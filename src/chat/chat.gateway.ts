import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  constructor() {}

  @WebSocketServer() server: Server;

  handleConnection() {
    this.server.emit('roomChange', this.publicRooms());
  }

  //- 라이브 채팅 -//
  @SubscribeMessage('chatInput')
  chat(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    // socket.join(data.roomName);
    this.server.of('/').to(data.roomName).emit('newMsg', data.chat);
  }

  //- 라이브 방 입장 -//
  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    socket.join(data.title);
    this.server.emit('roomChange', this.publicRooms());
  }

  //- 모든 라이브 목록 -//
  publicRooms() {
    const {
      adapter: { sids, rooms },
    } = this.server.of('/');
    const publicRoom = {};
    rooms.forEach((_, key) => {
      if (sids.get(key) === undefined) {
        publicRoom[key] = this.countRoom(key);
      }
    });
    return publicRoom;
  }

  //- 라이브 인원 수 -//
  countRoom(roomName) {
    return this.server.of('/').adapter.rooms.get(roomName)?.size;
  }
}
