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
import {
  CreateRoomDTO,
  JoinRoomDTO,
  MatchMoveDTO,
  Room,
} from '../interface/room';
import { ISocketWithUserData } from '../interface/socketWithUserData';
import { plainToClass } from 'class-transformer';
import { use } from 'passport';

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

  /**
   * Method used for handling client socket disconnecting.
   * @param socket: client socket
   */
  async handleDisconnect(socket: ISocketWithUserData) {
    try {
      console.log('dis');
      const userId = socket.data.userId;
      const user = await this.userService.getUserWithId(userId);
      const socketIndex = user.currentSocketInstances.indexOf(socket.id);
      if (socketIndex >= 0) user.currentSocketInstances.splice(socketIndex, 1);
      if (user.currentSocketInstances.length === 0) {
        if (user.currentRoom) {
          const plainRoomObj = await this.redisService.cacheManager.get<Room>(
            user.currentRoom,
          );
          const room = plainToClass(Room, plainRoomObj);
          const roomAfterLeave = room.handleLeave(user.username);
          if (
            roomAfterLeave.player.length + roomAfterLeave.viewer.length ===
            0
          ) {
            await this.redisService.cacheManager.del(user.currentRoom);
            this.namespace.emit(
              'room_change',
              room.changeToDTO(),
              'remove_room',
            );
          } else {
            await this.redisService.cacheManager.set<Room>(
              user.currentRoom,
              roomAfterLeave,
            );
            this.namespace.emit(
              'room_change',
              roomAfterLeave.changeToDTO(),
              'change',
            );
            this.namespace
              .to(room.name)
              .emit('room_member_change', roomAfterLeave.changeToDTO());
          }
          user.currentRoom = undefined;
        }
      }

      await user.save();
    } catch (error: any) {
      console.error(error);
    }
  }

  /**
   * Method used for handling websocket connection. User authentication will be processed
   * here and user's id will be attach to the socket instance for later use
   * @param socket: client socket
   */
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
      user.currentSocketInstances.push(socket.id);
      await user.save();
      socket.data.userId = user._id;
      socket.emit('connect_accept');
    } catch (error: any) {
      console.log(error);
      socket.disconnect();
    }
  }

  /**
   * Method used to retrieve user current room data, used when a new websocket connection
   * of a same user established
   * @param socket : client socket
   */
  @SubscribeMessage('retrieve_current_room')
  async listenForRetrieveCurrentRoom(
    // @MessageBody() { roomName, roomPassword }: JoinRoomDTO,
    @ConnectedSocket() socket: ISocketWithUserData,
  ) {
    const userId = socket.data.userId;
    if (!userId) return;
    const user = await this.userService.getUserWithId(userId);
    if (!user.currentRoom) return { success: false };
    const roomFromRedis = await this.redisService.cacheManager.get<Room>(
      user.currentRoom,
    );
    if (!roomFromRedis) return;
    const room = plainToClass(Room, roomFromRedis);
    socket.join(user.currentRoom);
    return { success: true, data: room.changeToDTO() };
  }

  /**
   * Method used for handling request to join room from client socket
   * @param param0 Authenticate data of the requested room: name and password
   * @param socket client socket
   * @returns
   */
  @SubscribeMessage('join_room')
  async listenForJoiningRoomRequest(
    @MessageBody() { roomName, roomPassword }: JoinRoomDTO,
    @ConnectedSocket() socket: ISocketWithUserData,
  ) {
    const userId = socket.data.userId;
    if (!userId) return;
    const user = await this.userService.getUserWithId(userId);
    if (user.currentRoom) return;
    const roomFromRedis = await this.redisService.cacheManager.get<Room>(
      roomName,
    );
    if (!roomFromRedis) return;
    const roomDetail = plainToClass(Room, roomFromRedis);
    if (!roomDetail.password || roomDetail.password === roomPassword) {
      user.currentSocketInstances.forEach((socketId) =>
        this.namespace.sockets.get(socketId).join(roomName),
      );
      socket.join(roomName);
      roomDetail.handleJoin(user.username);
      await this.redisService.cacheManager.set<Room>(roomName, roomDetail);
      user.currentRoom = roomName;
      await user.save();
      this.namespace.emit('room_change', roomDetail.changeToDTO(), 'change');
      this.namespace
        .to(roomName)
        .emit('room_member_change', roomDetail.changeToDTO());
      return {
        data: roomDetail.changeToDTO(),
      };
    }
  }

  /**
   * Method used for fetching all room when a client socket establish a connection
   * @param socket client socket
   * @returns
   */
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
      .map((room) => {
        const convertRoom = plainToClass(Room, room);
        return convertRoom.changeToDTO();
      });
    return result;
  }

  /**
   * Method used for handling create room request
   * @param param0 Authentication data: room name and password
   * @param socket client socket
   * @returns
   */
  @SubscribeMessage('create_room')
  async listenForCreateRoom(
    @MessageBody() { roomName, roomPassword }: CreateRoomDTO,
    @ConnectedSocket() socket: ISocketWithUserData,
  ) {
    const userId = socket.data.userId;
    if (!userId) return;
    const user = await this.userService.getUserWithId(userId);
    if (user.currentRoom)
      return {
        errorMessage: 'You are already in a room',
      };
    const isExist = this.namespace.adapter.rooms.get(roomName);
    if (isExist)
      return {
        errorMessage: 'This name is already taken. Choose another name',
      };
    user.currentSocketInstances.forEach((socketId) =>
      this.namespace.sockets.get(socketId).join(roomName),
    );
    // socket.join(roomName);
    const newRoom = new Room(roomName, user.username, roomPassword);
    await this.redisService.cacheManager.set<Room>(roomName, newRoom);
    user.currentRoom = roomName;
    await user.save();
    this.namespace.emit('room_change', newRoom.changeToDTO(), 'new_room');
    return { data: plainToClass(Room, newRoom).changeToDTO() };
  }

  /**
   * Method used for handling match move
   * @param param0 Coordinate of the move
   * @param socket client socket
   * @returns
   */
  @SubscribeMessage('match_move')
  async listenForMatchMove(
    @MessageBody() { xIndex, yIndex }: MatchMoveDTO,
    @ConnectedSocket() socket: ISocketWithUserData,
  ) {
    const userId = socket.data.userId;
    if (!userId) return;
    const user = await this.userService.getUserWithId(userId);
    if (!user.currentRoom) return;
    const roomFromRedis = await this.redisService.cacheManager.get<Room>(
      user.currentRoom,
    );
    const room = plainToClass(Room, roomFromRedis);
    const result = room.handleMove(user.username, xIndex, yIndex);
    if (!result) return result;
    this.namespace.to(user.currentRoom).emit('match_move', xIndex, yIndex);
    const matchResult = room.calculateResult();
    if (matchResult) {
      room.onGoingMatch.result = matchResult;
      this.namespace.to(user.currentRoom).emit('match_finish', matchResult);
      setTimeout(async () => {
        room.onGoingMatch = undefined;
        room.player = room.player.map((player) => ({
          ...player,
          isReady: false,
        }));
        await this.redisService.cacheManager.set<Room>(user.currentRoom, room);
        this.namespace
          .to(user.currentRoom)
          .emit('room_member_change', room.changeToDTO());
      }, 3000);
    }
    await this.redisService.cacheManager.set<Room>(user.currentRoom, room);
    // socket.to(user.currentRoom).emit('match_move', xIndex, yIndex);

    // this.namespace.to().
    // this.namespace.broadcast(user.currentRoom).broadcast('match_move', { xIndex, yIndex });
    return true;
  }

  /**
   * Method used for handling a room viewer's request be a player
   * @param pos shorthand for position
   * @param socket client socket
   * @returns
   */
  @SubscribeMessage('request_to_be_player')
  async listenForRequestJoinMatch(
    @MessageBody() pos: 1 | 2,
    @ConnectedSocket() socket: ISocketWithUserData,
  ) {
    const userId = socket.data.userId;
    if (!userId) return;
    const user = await this.userService.getUserWithId(userId);
    if (!user.currentRoom) return;
    const roomFromRedis = await this.redisService.cacheManager.get<Room>(
      user.currentRoom,
    );
    const room = plainToClass(Room, roomFromRedis);
    const result = room.handleRequestToPlay(user.username, pos);
    if (!result) return result;
    await this.redisService.cacheManager.set<Room>(user.currentRoom, room);
    this.namespace.emit('room_change', room.changeToDTO(), 'change');
    this.namespace
      .to(user.currentRoom)
      .emit('room_member_change', room.changeToDTO());
    // this.namespace.to().
    // this.namespace.broadcast(user.currentRoom).broadcast('match_move', { xIndex, yIndex });
    return result;
  }

  /**
   * Method used for handling a room player's request to be a viewer
   * @param socket client socket
   * @returns
   */
  @SubscribeMessage('request_to_be_viewer')
  async listenForRequestToBeViewer(
    // @MessageBody() pos: 1 | 2,
    @ConnectedSocket() socket: ISocketWithUserData,
  ) {
    const userId = socket.data.userId;
    if (!userId) return;
    const user = await this.userService.getUserWithId(userId);
    if (!user.currentRoom) return;
    const roomFromRedis = await this.redisService.cacheManager.get<Room>(
      user.currentRoom,
    );
    const room = plainToClass(Room, roomFromRedis);
    const result = room.handleRequestToBeViewer(user.username);
    if (!result) return result;
    await this.redisService.cacheManager.set<Room>(user.currentRoom, room);
    this.namespace.emit('room_change', room.changeToDTO(), 'change');
    this.namespace
      .to(user.currentRoom)
      .emit('room_member_change', room.changeToDTO());
    // this.namespace.to().
    // this.namespace.broadcast(user.currentRoom).broadcast('match_move', { xIndex, yIndex });
    return result;
  }

  /**
   * Method used for handling a room player's ready status change
   * @param socket client socket
   * @returns
   */
  @SubscribeMessage('ready_status_change')
  async listenForReadyStatusChange(
    @ConnectedSocket() socket: ISocketWithUserData,
  ) {
    const userId = socket.data.userId;
    if (!userId) return;
    const user = await this.userService.getUserWithId(userId);
    if (!user.currentRoom) return;
    const roomFromRedis = await this.redisService.cacheManager.get<Room>(
      user.currentRoom,
    );
    const room = plainToClass(Room, roomFromRedis);
    const result = room.handlePlayerReadyStatusChange(user.username);
    if (!result) return result;
    if (
      room.player.length === 2 &&
      room.player.every((player) => player.isReady)
    ) {
      room.onGoingMatch = {
        matchMoves: Array(15)
          .fill(null)
          .map(() => Array(15).fill(null)),
        nextTurn: 1,
      };
      setTimeout(() => {
        this.namespace.to(user.currentRoom).emit('match_start', {
          matchMoves: room.onGoingMatch.matchMoves,
          nextTurn: 1,
        });
      }, 1000);
    }
    await this.redisService.cacheManager.set<Room>(user.currentRoom, room);
    this.namespace
      .to(user.currentRoom)
      .emit('room_member_change', room.changeToDTO());
    return result;
  }

  /**
   * Method used for handling leave room request
   * @param socket client socket
   * @returns
   */
  @SubscribeMessage('leave_room')
  async listenForLeaveRoom(@ConnectedSocket() socket: ISocketWithUserData) {
    const userId = socket.data.userId;
    if (!userId) return;
    const user = await this.userService.getUserWithId(userId);
    if (!user.currentRoom) return;
    const roomFromRedis = await this.redisService.cacheManager.get<Room>(
      user.currentRoom,
    );
    const room = plainToClass(Room, roomFromRedis);
    const roomAfterLeave = room.handleLeave(user.username);
    if (roomAfterLeave.player.length + roomAfterLeave.viewer.length === 0) {
      await this.redisService.cacheManager.del(user.currentRoom);
      this.namespace.emit('room_change', room.changeToDTO(), 'remove_room');
    } else {
      await this.redisService.cacheManager.set<Room>(
        user.currentRoom,
        roomAfterLeave,
      );
      this.namespace.emit(
        'room_change',
        roomAfterLeave.changeToDTO(),
        'change',
      );
      this.namespace
        .to(room.name)
        .emit('room_member_change', roomAfterLeave.changeToDTO());
    }
    user.currentSocketInstances.forEach((socketId) => {
      this.namespace.sockets.get(socketId).leave(room.name);
      this.namespace.to(socketId).emit('leave_room');
    });
    user.currentRoom = undefined;

    await user.save();
    return true;
  }
}
