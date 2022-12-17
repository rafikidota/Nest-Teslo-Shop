import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { MessagesWsService } from './messages-ws.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) { }
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.auth as string;
    let payload: JwtPayload
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.register(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.remove(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {

    //Emit only for client
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message!!'
    // });

    //Emit everybody except initial client
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message!!'
    // });

    //Emit everybody
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullNameBySocketId(client.id),
      message: payload.message || 'no-message!!'
    });
  }
}
