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
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  roomManager: string;

  constructor() {}

  @WebSocketServer() server: Server;

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.server.emit('roomChange', this.publicRooms());
  }

  handleDisconnect(socket: Socket) {
    this.server.emit('disconnectRoom', socket.id);
    this.server.emit('roomChange', this.publicRooms());
  }

  //- 라이브 채팅 -//
  @SubscribeMessage('chatInput')
  chat(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    this.server.of('/').to(data.roomName).emit('newMsg', data.chat);
  }

  //- 라이브 방 입장 -//
  @SubscribeMessage('join_room')
  async joinRoom(@MessageBody() roomName, @ConnectedSocket() socket: Socket) {
    console.log('들어온 사람 아이디', socket.id);
    await socket.join(roomName);
    this.server.emit('roomChange', this.publicRooms());
    socket.to(roomName).emit('welcome', socket.id);
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

  //- webRTC -//

  //- offer 보내기 -//
  @SubscribeMessage('offer')
  offer(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    socket.to(data.socketId).emit('offer', data.offer, socket.id);
  }

  //- answer 보내기 -//
  @SubscribeMessage('answer')
  answer(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    socket.to(data.socketId).emit('answer', data.answer, socket.id);
  }

  //- candidate 보내기 -//
  @SubscribeMessage('ice')
  ice(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    socket.to(data.id).emit('ice', data.ice, socket.id);
  }
}
