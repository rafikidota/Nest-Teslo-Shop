import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

interface ConnectedClient {
    [id: string]: {
        socket: Socket;
        user: User;
    }
}

@Injectable()
export class MessagesWsService {
    private connectedClients = {};
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async register(client: Socket, userId: string) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.isActive) {
            throw new Error('User not active');
        }
        this.connectedClients[client.id] = {
            socket: client,
            user
        };
    }
    remove(clientID: string) {
        delete this.connectedClients[clientID];
    }
    getConnectedClients(): string[] {
        return Object.keys(this.connectedClients);
    }

    getUserFullNameBySocketId(socketId: string) {
        return this.connectedClients[socketId].user.fullName;
    }
}
