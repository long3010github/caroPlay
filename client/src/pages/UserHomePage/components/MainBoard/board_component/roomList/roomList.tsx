import React from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';
import { Room } from './room.interface';
import { RoomDetail } from './roomDetail';

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
  roomList: Room[];
  socket?: Socket;
}

export const RoomList = ({ roomList }: PropTypes) => {
  const rooms = roomList.map((room) => (
    <RoomDetail {...room} key={room?.roomName} />
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
