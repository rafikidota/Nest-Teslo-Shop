import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true})
// @WebSocketGateway({ cors: true, namespace: '/' })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messagesWsService: MessagesWsService
  ) { }
  handleConnection(client: Socket) {
    this.messagesWsService.register(client);
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.remove(client.id);
  }
}
