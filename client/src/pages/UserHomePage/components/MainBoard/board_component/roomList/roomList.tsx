import React from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';
import { ErrorModal } from '../../../../../../components/ErrorModal';
import { RootState } from '../../../../../../store';
import { setCurrentRoom } from '../../../../../../store/game/slice';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hook';
import { showWithComponent } from '../../../../../../store/Modal/slice';
import { JoinRoomResult, Room } from '../../interface/room.interface';
import { RoomCard } from './roomCard';

const Container = styled.div`
  padding: 10px 10px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const NoRoom = styled.div`
  text-align: center;
  font-size: 30px;
`;

interface PropTypes {
  socket?: Socket;
}

export const RoomList = ({ socket }: PropTypes) => {
  const roomList = useAppSelector((state: RootState) => state.game.roomList);
  const dispatch = useAppDispatch();

  const handleJoinRoom = (roomName: string, roomPassword?: string) => {
    socket?.emit(
      'join_room',
      { roomName, roomPassword },
      ({ errorMessage, data }: JoinRoomResult) => {
        if (errorMessage) {
          return dispatch(
            showWithComponent(<ErrorModal errorMessage={errorMessage} />)
          );
        }
        // if (data) {
        //   dispatch(setCurrentRoom(data));
        // }
      }
    );
  };

  const rooms = roomList.map((room) => (
    <RoomCard room={room} key={room?.name} handleJoinRoom={handleJoinRoom} />
  ));
  return (
    <Container>
      {rooms.length ? (
        rooms
      ) : (
        <NoRoom>No rooms yet. Create your own room</NoRoom>
      )}
    </Container>
  );
};
