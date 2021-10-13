export interface CreateRoomDTO {
  roomName: string;
  roomPassword?: string;
}

export class Room {
  name: string;
  owner: string;
  password?: string;
  player: string[];
  onGoingMatch?: boolean;

  constructor(name: string, owner: string, password?: string) {
    this.owner = owner;
    this.password = password;
    this.name = name;
    this.player = [owner];
  }

  public async handleJoin(username: string) {
    if (!this.player.includes(username))
      this.player = [...this.player, username];
  }

  public changeToDTO() {
    return {
      roomName: this.name,
      roomAmount: this.player.length,
      havePassword: !!this.password,
    };
  }
}
