import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClient {
    [id: string]: Socket
}

@Injectable()
export class MessagesWsService {
    private connectedClients = {};

    register(client: Socket) {
        this.connectedClients[client.id] = client;
    }
    remove(clientID: string) {
        delete this.connectedClients[clientID];
    }
    getConnectedClients(): number {
        return Object.keys(this.connectedClients).length;
    }
}
