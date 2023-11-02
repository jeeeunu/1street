import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
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

  @WebSocketServer() server: Server; // WebSocket 서버 객체를 생성 및 주입

  // 클라이언트가 WebSocket에 연결될 때 호출되는 메서드
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.server.emit('roomChange', this.publicRooms());
  }

  // 클라이언트가 WebSocket 연결을 해제할 때 호출되는 메서드
  handleDisconnect(socket: Socket) {
    this.server.emit('disconnectRoom', socket.id);
    this.server.emit('roomChange', this.publicRooms());
  }

  // 클라이언트 간의 라이브 채팅 메시지를 처리하는 메서드
  @SubscribeMessage('chatInput')
  chat(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    this.server.of('/').to(data.roomName).emit('newMsg', data.chat);
  }

  // 클라이언트가 라이브 방에 입장할 때 호출되는 메서드
  @SubscribeMessage('join_room')
  async joinRoom(@MessageBody() roomName, @ConnectedSocket() socket: Socket) {
    await socket.join(roomName);
    this.server.emit('roomChange', this.publicRooms());
    socket.to(roomName).emit('welcome', socket.id);
  }

  // 모든 라이브 방 목록을 반환하는 메서드
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

  // 특정 라이브 방의 인원 수를 반환하는 메서드
  countRoom(roomName) {
    return this.server.of('/').adapter.rooms.get(roomName)?.size;
  }

  //---- webRTC ----//
  // WebRTC를 사용하여 offer 메시지를 보내는 메서드
  @SubscribeMessage('offer')
  offer(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    socket.to(data.socketId).emit('offer', data.offer, socket.id);
  }

  // WebRTC를 사용하여 answer 메시지를 보내는 메서드
  @SubscribeMessage('answer')
  answer(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    socket.to(data.socketId).emit('answer', data.answer, socket.id);
  }

  // WebRTC를 사용하여 ICE candidate 메시지를 보내는 메서드
  // 역할: 각 네트워크 정보 교환, 브라우저 간의 P2P 연결을 설정함
  @SubscribeMessage('ice')
  ice(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    socket.to(data.id).emit('ice', data.ice, socket.id);
  }
}
