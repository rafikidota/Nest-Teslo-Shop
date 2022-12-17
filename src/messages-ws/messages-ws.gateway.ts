import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService
  ) { }
  handleConnection(client: Socket) {
    this.messagesWsService.register(client);
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
      fullName: 'Soy yo',
      message: payload.message || 'no-message!!'
    });
  }
}
