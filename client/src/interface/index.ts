import { Room } from '../pages/UserHomePage/components/MainBoard/interface/room.interface';

export interface LoginData {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  password: string;
}

export interface RetrieveCurrentRoom {
  success: boolean;
  data: Room;
}
