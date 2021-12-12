import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { stat } from 'fs';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { IOType } from '../store/socket/ioType';
import {
  OnGoingMatch,
  Room,
} from '../pages/UserHomePage/components/MainBoard/interface/room.interface';
import {
  clearCurrentRoom,
  MatchState,
  Move,
  setCurrentRoom,
  setMatchResult,
  setMatchState,
  setMatchStateAfterMove,
  setRoomList,
  setRoomListAfterChange,
} from '../store/game/slice';
import { ILeaderBoard, RetrieveCurrentRoom } from '../interface';
import { RootState } from '../store';
import { socketHelper } from '../helpers/socketHelper';
import { resetTimer, setActiveTimer } from '../store/timer/slice';
import { Message } from '../store/chat/interface';
import { addMessage } from '../store/chat/slice';
import { updateAfterMatchFinish } from '../store/auth/slice';
import { setLeaderBoards } from '../store/leaderboards/slice';

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
  const myRoom = useAppSelector((state: RootState) => state.game.currentRoom);
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
                if (room.onGoingMatch.timeout) {
                  dispatch(setActiveTimer(room.onGoingMatch.timeout));
                }
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

      ioInstance.on('sync_join', (room: Room) => {
        const myRole = socketHelper.getMyRole(me, room);
        if (!myRole) return;
        dispatch(setCurrentRoom({ room, me: myRole }));
        if (room.onGoingMatch) {
          dispatch(setMatchState(room.onGoingMatch));
          if (room.onGoingMatch.timeout) {
            dispatch(setActiveTimer(room.onGoingMatch.timeout));
          }
        }
      });

      ioInstance.on('match_move', (xIndex: number, yIndex: number) => {
        dispatch(setMatchStateAfterMove({ xIndex, yIndex }));
        dispatch(setActiveTimer({ type: 'matchMove', remain: 15 }));
      });

      ioInstance.on('match_start', (matchStartState: OnGoingMatch) => {
        dispatch(setActiveTimer({ type: 'matchStart', remain: 3 }));
        // dispatch(setMatchState(matchStartState));
      });

      ioInstance.on('match_start_cancel', () => {
        dispatch(setMatchState(undefined));
        dispatch(resetTimer());
      });

      ioInstance.on('match_start_count', (matchStartState: OnGoingMatch) => {
        dispatch(setActiveTimer({ type: 'matchMove', remain: 15 }));
        dispatch(setMatchState(matchStartState));
      });

      ioInstance.on(
        'match_result',
        (matchResult: { winner: 1 | 2; streak: Move[]; reason?: string }) => {
          dispatch(setMatchResult(matchResult));
          dispatch(resetTimer());
          dispatch(setActiveTimer({ type: 'matchFinish', remain: 5 }));
        }
      );

      ioInstance.on('match_finish', (room: Room) => {
        dispatch(setMatchState(undefined));
        dispatch(resetTimer());
        const myRole = socketHelper.getMyRole(me, room);
        if (!myRole) return;
        dispatch(setCurrentRoom({ room, me: myRole }));
      });

      ioInstance.on('leave_room', () => {
        dispatch(clearCurrentRoom());
        dispatch(setMatchState(undefined));
        dispatch(resetTimer());
      });

      ioInstance.on('global_chat', (message: Message) => {
        dispatch(addMessage({ ...message }));
      });

      ioInstance.on(
        'update_after_match',
        (info: { win: number; lose: number; username: string }) => {
          dispatch(updateAfterMatchFinish(info));
        }
      );

      ioInstance.on('leaderBoard', (leaderBoard: ILeaderBoard[]) => {
        dispatch(setLeaderBoards(leaderBoard));
      });

      return ioInstance;
    } catch (error: any) {
      console.trace(error);
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
    };
  }, []);

  return {
    isLoading,
    errorMessage,
    socket,
  };
};
