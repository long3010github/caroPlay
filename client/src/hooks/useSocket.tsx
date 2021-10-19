import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { IOType } from '../store/socket/ioType';
import { Room } from '../pages/UserHomePage/components/MainBoard/interface/room.interface';
import {
  clearCurrentRoom,
  MatchState,
  setCurrentRoom,
  setMatchState,
  setMatchStateAfterMove,
  setRoomList,
  setRoomListAfterChange,
} from '../store/game/slice';
import { RetrieveCurrentRoom } from '../interface';
import { RootState } from '../store';
import { socketHelper } from '../helpers/socketHelper';
import { resetTimer, setActiveTimer } from '../store/timer/slice';

/**
 * Custom hook use to establish a websocket connection to server and register
 * event listener to it
 * @param ioType
 * @returns
 */
export const useSocket = (ioType: IOType) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [socket, setSocket] = useState<Socket | undefined>();
  const me = useAppSelector((state: RootState) => state.auth.userInfo);

  const getMyRole = () => {
    if (!me) return;
    return me.username;
  };

  // const [roomList, setRoomList] = useState<Room[]>([]);
  // const [currentRoom, setCurrentRoom] = useState<Room | undefined>();

  const dispatch = useAppDispatch();

  const getIOConnection = () => {
    try {
      const ioInstance = io(
        `${process.env.REACT_APP_API || 'http://localhost:3000'}/game`,
        { withCredentials: true }
      );
      ioInstance.on('connect_error', () => {
        console.log('connect error');
        setErrorMessage(
          'Cant connect to server, trying to establish connection'
        );
        dispatch(setRoomList([]));
        dispatch(clearCurrentRoom());
        dispatch(setMatchState(undefined));
        dispatch(resetTimer());
      });
      ioInstance.on('connect', () => {
        console.log('connected');
        setIsLoading(false);
        setErrorMessage(undefined);
        // dispatch(setSocketInstance({ ioType, ioInstance }));
      });
      ioInstance.on('disconnect', () => {
        console.log('disconnected');
        setErrorMessage('Oops, something wrong');
        dispatch(setRoomList([]));
        dispatch(clearCurrentRoom());
        dispatch(setMatchState(undefined));
        dispatch(resetTimer());
      });

      ioInstance.on('connect_accept', () => {
        ioInstance.emit('fetch_rooms', (fetchedRoomList: Room[]) => {
          dispatch(setRoomList(fetchedRoomList));
          ioInstance.emit(
            'retrieve_current_room',
            ({ success, data: room }: RetrieveCurrentRoom) => {
              if (!success) return;
              const myRole = socketHelper.getMyRole(me, room);
              if (!myRole) return;
              dispatch(setCurrentRoom({ room, me: myRole }));
              if (room.onGoingMatch) {
                dispatch(setMatchState(room.onGoingMatch));
                dispatch(setActiveTimer('matchMove'));
              }
            }
          );
        });
      });

      ioInstance.on('room_change', (room: Room, type: string) => {
        dispatch(setRoomListAfterChange({ room, type }));
      });

      ioInstance.on('room_member_change', (room: Room) => {
        const myRole = socketHelper.getMyRole(me, room);
        if (!myRole) return;
        dispatch(setCurrentRoom({ room, me: myRole }));
      });

      ioInstance.on('match_move', (xIndex: number, yIndex: number) => {
        console.log('receive move');
        dispatch(setMatchStateAfterMove({ xIndex, yIndex }));
        dispatch(setActiveTimer('matchMove'));
      });

      ioInstance.on('match_start', (matchStartState: MatchState) => {
        dispatch(setActiveTimer('matchStart'));
        dispatch(setMatchState(matchStartState));
      });

      ioInstance.on('match_finish', (matchResult: 1 | 2) => {
        console.log(matchResult);
        dispatch(setMatchState(undefined));
        dispatch(resetTimer());
      });

      ioInstance.on('leave_room', () => {
        dispatch(clearCurrentRoom());
        dispatch(resetTimer());
      });

      return ioInstance;
    } catch (error: any) {
      console.log(error);
      // setHasError(true);
    }
    // setIsLoading(false); // fix here
  };

  useEffect(() => {
    const ioInstance = getIOConnection();
    setSocket(ioInstance);
    return () => {
      ioInstance?.disconnect();
      dispatch(setRoomList([]));
      dispatch(clearCurrentRoom());
      dispatch(setMatchState(undefined));
      dispatch(resetTimer());
      // setSocket(undefined);
    };
  }, []);

  return {
    isLoading,
    errorMessage,
    socket,
  };
};
