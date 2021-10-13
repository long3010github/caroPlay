import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { parse } from 'cookie';
import { Socket, Namespace } from 'socket.io';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { RedisService } from 'src/redis/redis.service';
import { UserService } from 'src/user/user.service';
import { CreateRoomDTO, Room } from '../interface/room';
import { ISocketWithUserData } from '../interface/socketWithUserData';
import { plainToClass } from 'class-transformer';

@WebSocketGateway({
  namespace: 'game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  namespace: Namespace;

  constructor(
    private authenticationService: AuthenticationService,
    private redisService: RedisService,
    private userService: UserService,
  ) {}
  async handleDisconnect(socket: ISocketWithUserData) {
    try {
      console.log('dis');
      const userId = socket.data.userId;
      const user = await this.userService.getUserWithId(userId);
      if (user.currentRoom) {
        const plainRoomObj = await this.redisService.cacheManager.get<Room>(
          user.currentRoom,
        );
        const room = plainToClass(Room, plainRoomObj);
        if (room.player.length === 1) {
          await this.redisService.cacheManager.del(user.currentRoom);
          this.namespace.emit('room_change', room.changeToDTO(), 'remove_room');
        } else {
          room.player.splice(room.player.indexOf(user.username), 1);
          await this.redisService.cacheManager.set<Room>(
            user.currentRoom,
            room,
          );
          this.namespace.emit('room_change', room.changeToDTO(), 'change');
        }
        user.currentRoom = undefined;
        await user.save();
        console.trace(user);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async handleConnection(socket: Socket) {
    const cookies = socket.handshake.headers.cookie;
    const AccessToken = cookies && parse(cookies).AccessToken;
    if (!AccessToken) {
      return socket.disconnect();
    }

    try {
      const user = await this.authenticationService.verifyAccessToken(
        AccessToken,
      );
      if (!user) {
        return socket.disconnect();
      }
      socket.data.userId = user._id;
      socket.emit('connect_accept');
    } catch (error: any) {
      console.log(error);
      socket.disconnect();
    }
  }

  @SubscribeMessage('join_room')
  async listenForJoiningRoomRequest(
    @MessageBody() data: string,
    @ConnectedSocket() socket: ISocketWithUserData,
  ) {
    const userId = socket.data.userId;
    if (!userId) return;
    const user = await this.userService.getUserWithId(userId);
  }

  @SubscribeMessage('fetch_rooms')
  async listenForFetchRooms(
    // @MessageBody() data: string,
    @ConnectedSocket() socket: ISocketWithUserData,
  ) {
    const userId = socket.data.userId;
    if (!userId) return;
    const roomFromRedis = Array.from(this.namespace.adapter.rooms).map(
      (room): Promise<Room> => this.redisService.cacheManager.get(room[0]),
    );
    const rooms = await Promise.all(roomFromRedis);
    const result = rooms
      .filter((room) => room !== null)
      .map((room) => ({
        roomName: room.name,
        roomAmount: room.player.length,
        havePassword: !!room.password,
      }));
    return result;
  }

  @SubscribeMessage('create_room')
  async listenForCreateRoom(
    @MessageBody() { roomName, roomPassword }: CreateRoomDTO,
    @ConnectedSocket() socket: ISocketWithUserData,
  ) {
    const userId = socket.data.userId;
    if (!userId) return;
    const user = await this.userService.getUserWithId(userId);
    console.trace(user);
    if (user.currentRoom)
      return {
        success: false,
        errorMessage: 'You are already in a room',
      };
    const isExist = this.namespace.adapter.rooms.get(roomName);
    if (isExist)
      return {
        success: false,
        errorMessage: 'This name is already taken. Choose another name',
      };
    socket.join(roomName);
    const newRoom = new Room(roomName, user.username, roomPassword);
    await this.redisService.cacheManager.set<Room>(roomName, newRoom);
    user.currentRoom = roomName;
    await user.save();
    this.namespace.emit('room_change', newRoom.changeToDTO(), 'new_room');
  }
}
