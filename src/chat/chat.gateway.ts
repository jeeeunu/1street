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
  joinRoom(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    console.log('들어온 사람 아이디', socket.id);
    if (!this.publicRooms().hasOwnProperty(data)) {
      socket.join(data);
      this.roomManager = socket.id;
      console.log('방장 아이디 백엔드:', this.roomManager, data);
      this.server.of('/').to(data).emit('room_manager', socket.id);
    } else {
      console.log('일반 유저', socket.id, data);
      socket.join(data);
    }
    this.server.emit('roomChange', this.publicRooms());
    socket.to(data).emit('welcome', socket.id);
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
    this.server.of('/').to(data.id).emit('offer', data.offer);
  }

  //- answer 보내기 -//
  @SubscribeMessage('answer')
  answer(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    this.server.of('/').to(this.roomManager).emit('answer', data.answer);
  }

  //- candidate 보내기 -//
  @SubscribeMessage('ice')
  ice(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    console.log('아이스 받기', data);
    if (data.user !== null) {
      this.server.of('/').to(data.user).emit('ice', data.candidate);
    } else {
      this.server.of('/').to(this.roomManager).emit('ice', data.candidate);
    }
  }
}
