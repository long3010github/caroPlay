import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';
import { ErrorModal } from '../../../../../../components/ErrorModal';
import { RootState } from '../../../../../../store';
import {
  setCurrentRoom,
  setMatchState,
} from '../../../../../../store/game/slice';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hook';
import { showWithComponent } from '../../../../../../store/Modal/slice';
import { setActiveTimer } from '../../../../../../store/timer/slice';
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

const Filter = styled.div`
  height: fit-content;
  width: fit-content;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
  margin-bottom: 20px;
`;

const FilterInput = styled.input`
  padding: 4px 5px;
  width: 200px;
`;

const Rooms = styled.div`
  padding: 10px 10px;
  border: 1px solid black;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  overflow-y: auto;
  height: 400px;
`;

interface PropTypes {
  socket?: Socket;
}

export const RoomList = ({ socket }: PropTypes) => {
  const roomList = useAppSelector((state: RootState) => state.game.roomList);
  const [filterValue, setFilterValue] = useState('');
  const dispatch = useAppDispatch();

  const handleJoinRoom = (roomName: string, roomPassword?: string) => {
    socket?.emit('join_room', { roomName, roomPassword });
  };

  const filteredRoom = roomList
    .filter((room) => room.name.includes(filterValue))
    .map((room) => (
      <RoomCard room={room} key={room?.name} handleJoinRoom={handleJoinRoom} />
    ));
  return (
    <Container>
      <Filter>
        <FilterInput
          placeholder="Enter filter"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFilterValue(e.target.value);
          }}
        />
      </Filter>
      <Rooms>
        {filteredRoom.length ? filteredRoom : <NoRoom>No room</NoRoom>}
      </Rooms>
    </Container>
  );
};
