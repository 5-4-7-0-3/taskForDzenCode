import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly clients: Map<string, Socket> = new Map();
  private readonly postRooms: Map<number, Set<string>> = new Map();

  addClient(userId: string, client: Socket): void {
    this.clients.set(userId, client);
  }

  removeClient(userId: string): void {
    this.clients.delete(userId);
  }

  sendMessageToUser(userId: string, message: string): void {
    const client = this.clients.get(userId);
    if (client) {
      client.emit('message', message);
    }
  }

  async joinPostRoom(userId: string, postId: number): Promise<void> {
    if (!this.postRooms.has(postId)) {
      this.postRooms.set(postId, new Set());
    }
    this.postRooms.get(postId).add(userId);
  }

  leavePostRoom(userId: string, postId: number): void {
    const postRoom = this.postRooms.get(postId);
    if (postRoom) {
      postRoom.delete(userId);
      if (postRoom.size === 0) {
        this.postRooms.delete(postId);
      }
    }
  }
  
  sendCommentNotification(postId: number, text: string): void {
    const postRoom = this.postRooms.get(postId);
    
    if (postRoom) {

      postRoom.forEach(userId => {
        const client = this.clients.get(userId);
        if (client) {
          client.emit('newComment', 'New comment added!');
        }
      });
    }
  }
}
