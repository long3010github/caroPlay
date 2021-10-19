// import createSlice and type definition
import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
import {
  OnGoingMatch,
  Player,
  Room,
  Viewer,
} from '../../pages/UserHomePage/components/MainBoard/interface/room.interface';
import type { RootState } from '../index';
// import { UserInfo } from './interface';

export interface ICurrentRoom {
  room: Room;
  me: Viewer | Player;
}

// Define a type for the slice state
interface GameState {
  roomList: Room[];
  currentRoom?: ICurrentRoom;
  currentMatch?: OnGoingMatch;
}

// Define the initial state using that type
const initialState: GameState = {
  roomList: [],
};

interface RoomChange {
  room: Room;
  // type: 'new_room' | 'remove_room' | 'room_change';
  type: string;
}

interface Move {
  xIndex: number;
  yIndex: number;
}

export interface MatchState {
  matchMoves: (1 | 2 | null)[][];
  nextTurn: 1 | 2;
}

export const gameSlice = createSlice({
  name: 'game',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRoomList: (state, action: PayloadAction<Room[]>) => ({
      ...state,
      roomList: action.payload,
    }),
    setRoomListAfterChange: (state, action: PayloadAction<RoomChange>) => {
      const { room, type } = action.payload;
      switch (type) {
        case 'new_room':
          state.roomList.push(room);
          break;
        case 'remove_room':
          const index1 = state.roomList.findIndex(
            (roomData) => roomData.name === room.name
          );
          if (index1 >= 0) {
            state.roomList.splice(index1, 1);
          }
          break;
        case 'change':
          const index2 = state.roomList.findIndex(
            (roomData) => roomData.name === room.name
          );
          if (index2 >= 0) {
            state.roomList[index2] = room;
          }
          break;
        default:
        // console.log(room);
        // console.log(type);
      }
    },
    setCurrentRoom: (state, action: PayloadAction<ICurrentRoom>) =>
      // const
      ({
        ...state,
        currentRoom: action.payload,
      }),
    clearCurrentRoom: (state) =>
      // const
      ({
        ...state,
        currentRoom: undefined,
      }),
    setMatchState: (state, action: PayloadAction<OnGoingMatch | undefined>) => {
      state.currentMatch = action.payload;
    },
    setMatchStateAfterMove: (state, action: PayloadAction<Move>) => {
      const { xIndex, yIndex } = action.payload;
      const currentMatchState: OnGoingMatch | undefined = JSON.parse(
        JSON.stringify(state.currentMatch)
      );
      if (!currentMatchState) return;
      currentMatchState.matchMoves[xIndex][yIndex] = currentMatchState.nextTurn;
      currentMatchState.nextTurn = currentMatchState.nextTurn === 1 ? 2 : 1;
      currentMatchState.lastMove = { xIndex, yIndex };
      state.currentMatch = currentMatchState;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
  },
});

export const {
  setRoomList,
  setRoomListAfterChange,
  setCurrentRoom,
  setMatchState,
  setMatchStateAfterMove,
  clearCurrentRoom,
} = gameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default gameSlice.reducer;
