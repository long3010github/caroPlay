export interface CreateRoomDTO {
  roomName: string;
  roomPassword?: string;
}

export type JoinRoomDTO = CreateRoomDTO;

export interface MatchMoveDTO {
  xIndex: number;
  yIndex: number;
}

export interface Player {
  name: string;
  pos: 1 | 2;
  isReady: boolean;
}

export interface Viewer {
  name: string;
}

export interface OnGoingMatch {
  matchMoves: (number | null)[][];
  nextTurn: 1 | 2;
  result?: 1 | 2;
}

/**
 * Class used for working with room
 */
export class Room {
  name: string;
  owner: string;
  password?: string;
  player: Player[];
  viewer: Viewer[];
  onGoingMatch?: OnGoingMatch;
  // inRoom: string[];

  constructor(name: string, owner: string, password?: string) {
    this.owner = owner;
    this.password = password;
    this.name = name;
    this.player = [{ name: owner, pos: 1, isReady: false }];
    this.viewer = [];
    // this.inRoom = [owner];
  }

  /**
   * Method used for handling join request. User will join room as a viewer
   * @param username username of requested user
   * @returns true if user is not in room, false otherwise
   */
  public handleJoin(username: string) {
    if (
      this.viewer.findIndex((viewer) => viewer.name === username) < 0 &&
      this.player.findIndex((player) => player.name === username) < 0
    ) {
      this.viewer.push({ name: username });
      return true;
    }
    return false;
  }

  /**
   * Method used to handle user's request to be a player
   * @param username username of requested viewer
   * @param pos player position, either player 1 or 2
   * @returns true if ok, false otherwise
   */
  public handleRequestToPlay(username: string, pos: 1 | 2) {
    // check if that position is not empty
    if (this.player.findIndex((player) => player.pos === pos) >= 0)
      return false;

    // if the request's user is already a player, swap the position
    const indexPlayer = this.player.findIndex(
      (player) => player.name === username,
    );
    if (indexPlayer >= 0) this.player[indexPlayer].pos = pos;
    // otherwise fill the position with that user
    else {
      const indexViewer = this.viewer.findIndex(
        (viewer) => viewer.name === username,
      );
      if (indexViewer < 0) return false;
      this.player.push({
        name: username,
        pos,
        isReady: false,
      });
      this.viewer.splice(indexViewer, 1);
    }
    return true;
  }

  /**
   * Method used for handling player's request to be a viewer
   * @param username username of request user
   * @returns true if ok, false otherwise
   */
  public handleRequestToBeViewer(username: string) {
    // check if that user was a player and do other job
    const indexPlayer = this.player.findIndex(
      (player) => player.name === username,
    );
    if (indexPlayer < 0) return false;
    this.player.splice(indexPlayer, 1);
    this.viewer.push({ name: username });
    return true;
  }

  /**
   * Method used for handling player's status change
   * @param username player's username
   * @returns true if ok, false otherwise
   */
  public handlePlayerReadyStatusChange(username: string) {
    const index = this.player.findIndex((player) => player.name === username);
    if (index < 0) return false;
    this.player[index].isReady = !this.player[index].isReady;
    return true;
  }

  /**
   * Method for handling room's member leave
   * @param username
   * @returns
   */
  public handleLeave(username: string) {
    const isPlayer = this.player.findIndex(
      (player) => player.name === username,
    );
    if (isPlayer >= 0) this.player.splice(isPlayer, 1);
    const isViewer = this.viewer.findIndex(
      (viewer) => viewer.name === username,
    );
    if (isViewer >= 0) this.viewer.splice(isPlayer, 1);
    return this;
  }

  public handleMove(username: string, xIndex: number, yIndex: number) {
    if (!this.onGoingMatch || this.onGoingMatch.result) return false;
    const player = this.player.find((player) => player.name === username);
    if (!player || player.pos !== this.onGoingMatch.nextTurn) return false;
    this.onGoingMatch.matchMoves[xIndex][yIndex] = this.onGoingMatch.nextTurn;
    // const matchResult = this.calculateResult();
    // if (matchResult) {
    //   this.onGoingMatch.result = 1;
    // }
    this.onGoingMatch.nextTurn = this.onGoingMatch.nextTurn === 1 ? 2 : 1;
    return true;
  }

  public calculateResult(): 1 | 2 | null {
    if (!this.onGoingMatch) return null;
    if (
      this.onGoingMatch.matchMoves.reduce(
        (prevSum, currentCol) =>
          prevSum +
          currentCol.reduce((prev, cur) => (cur ? prev + 1 : prev), 0),
        0,
      ) >= 10
    ) {
      // this.onGoingMatch.result = 2;
      return 2;
    }
    return null;
  }

  /**
   * Method used for transforming an instance of class Room to a DTO
   * @returns a DTO
   */
  public changeToDTO() {
    return {
      name: this.name,
      owner: this.owner,
      havePassword: !!this.password,
      player: this.player,
      viewer: this.viewer,
      onGoingMatch: this.onGoingMatch,
    };
  }
}
