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
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   constructor() {}

//   @WebSocketServer() server: Server;

//   handleConnection(@ConnectedSocket() socket: Socket) {
//     this.server.emit('roomChange', this.publicRooms());
//   }

//   handleDisconnect() {
//     this.server.emit('roomChange', this.publicRooms());
//   }

//   //- 라이브 채팅 -//
//   @SubscribeMessage('chatInput')
//   chat(@MessageBody() data, @ConnectedSocket() socket: Socket) {
//     this.server.of('/').to(data.roomName).emit('newMsg', data.chat);
//   }

//   //- 라이브 방 입장 -//
//   @SubscribeMessage('joinRoom')
//   joinRoom(@MessageBody() data, @ConnectedSocket() socket: Socket) {
//     console.log('들어온 사람 아이디', socket.id);
//     // if (!this.publicRooms().hasOwnProperty(data.title)) {
//     //   socket.join(data.title);
//     //   socket.broadcast.to(data.title).emit('roomManager', socket.id);
//     // } else {
//     socket.join(data.title);
//     this.server.of('/').to(data.title).emit('welcome');
//     // }
//     this.server.emit('roomChange', this.publicRooms());
//   }

//   //- 모든 라이브 목록 -//
//   publicRooms() {
//     const {
//       adapter: { sids, rooms },
//     } = this.server.of('/');
//     const publicRoom = {};
//     rooms.forEach((_, key) => {
//       if (sids.get(key) === undefined) {
//         publicRoom[key] = this.countRoom(key);
//       }
//     });
//     return publicRoom;
//   }

//   //- 라이브 인원 수 -//
//   countRoom(roomName) {
//     return this.server.of('/').adapter.rooms.get(roomName)?.size;
//   }

//   //--- RTC 코드 ---//

//   //- offer받기 -//
//   @SubscribeMessage('makeOffer')
//   offer(@MessageBody() data, @ConnectedSocket() socket: Socket) {
//     socket.broadcast.to(data.title).emit('sendOffer', data.offer);
//   }

//   //- answer 받기 -//
//   @SubscribeMessage('answer')
//   answer(@MessageBody() data, @ConnectedSocket() socket: Socket) {
//     console.log('answer 백엔드', data);
//     socket.broadcast.to(data.title).emit('sendAnswer', data.answer);
//   }

//   //- ice받기 -//
//   @SubscribeMessage('ice')
//   ice(@MessageBody() data, @ConnectedSocket() socket: Socket) {
//     socket.broadcast.to(data.title).emit('sendIce', data.candidate);
//   }
// }
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

  @WebSocketServer() server: Server;

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.server.emit('roomChange', this.publicRooms());
  }

  handleDisconnect() {
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
    socket.join(data);
    this.server.emit('roomChange', this.publicRooms());
    socket.to(data).emit('welcome');
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
    socket.to(data.title).emit('offer', data.offer);
  }

  //- answer 보내기 -//
  @SubscribeMessage('answer')
  answer(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    socket.to(data.title).emit('answer', data.answer);
  }

  //- candidate 보내기 -//
  @SubscribeMessage('ice')
  ice(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    socket.to(data.title).emit('answer', data.candidate);
  }
}
