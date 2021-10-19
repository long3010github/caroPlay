import { Room } from '../pages/UserHomePage/components/MainBoard/interface/room.interface';
import { UserInfo } from '../store/auth/interface';

const getMyRole = (me: UserInfo | undefined, room: Room) => {
  if (!me) return null;
  const myRole =
    room.viewer.find((viewer) => viewer.name === me.username) ||
    room.player.find((player) => player.name === me.username);
  return myRole;
};

export const socketHelper = { getMyRole };
