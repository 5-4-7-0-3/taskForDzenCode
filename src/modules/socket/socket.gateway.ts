import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly socketService: SocketService) {}

  handleConnection(client: Socket): void {
  }

  handleDisconnect(client: Socket): void {
    const userId = this.findUserIdBySocketId(client.id);
    if (userId) {
      this.socketService.removeClient(userId);
    }
  }

  private findUserIdBySocketId(socketId: string): string | undefined {
    for (const [userId, client] of this.server.sockets.sockets.entries()) {
      if (client.id === socketId) {
        return userId;
      }
    }
    return undefined;
  }
}
