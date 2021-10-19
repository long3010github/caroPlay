export interface Player {
  name: string;
  pos: 1 | 2;
  isReady: boolean;
}

export interface Viewer {
  name: string;
}

export interface OnGoingMatch {
  matchMoves: (1 | 2 | null)[][];
  lastMove?: {
    xIndex: number;
    yIndex: number;
  };
  nextTurn: 1 | 2;
  result?: 1 | 2;
}
export interface Room {
  name: string;
  owner: string;
  havePassword: boolean;
  player: Player[];
  viewer: Viewer[];
  onGoingMatch?: OnGoingMatch;
}

export interface JoinRoomResult {
  errorMessage?: string;
  data: Room;
}
