export interface Player {
  name: string;
  pos: 1 | 2;
  isReady: boolean;
}

export interface Viewer {
  name: string;
}

interface Move {
  xIndex: number;
  yIndex: number;
}

export interface OnGoingMatch {
  matchMoves: (1 | 2 | null)[][];
  lastMove?: {
    xIndex: number;
    yIndex: number;
  };
  nextTurn: 1 | 2;
  result?: {
    winner: 1 | 2;
    streak?: Move[];
    reason?: string;
  };
  timeout: {
    type: 'matchStart' | 'matchMove' | 'matchFinish';
    remain: number;
  };
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
