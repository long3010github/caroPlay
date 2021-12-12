import React, { useRef } from 'react';
import styled from 'styled-components';
import { Room } from '../../interface/room.interface';

const Container = styled.div`
  border: 1px solid black;
  padding: 10px 10px;
  height: fit-content;
  width: 100%;
  margin-bottom: 15px;

  display: flex;
  /* flex-direction: column; */
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  padding: 5px 5px;
  height: 100%;
  width: 80%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const RoomName = styled.div`
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const RoomPlayers = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
`;

const Player = styled.div`
  height: fit-content;
  width: fit-content;
  padding: 5px 5px;
`;

const Versus = styled.div`
  height: fit-content;
  width: fit-content;
  margin-left: 40px;
  margin-right: 40px;
  font-size: 20px;
`;

const RoomAmount = styled.div`
  font-size: 20px;
`;

const Right = styled.div`
  padding: 25px 10px;
  height: fit-content;
  width: fit-content;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RoomPassword = styled.input`
  padding: 5px 5px;
  height: fit-content;
  width: 150px;
  margin-right: 30px;
`;

const JoinButton = styled.button`
  padding: 5px 5px;
  height: fit-content;
  width: 60px;
`;

interface PropTypes {
  room: Room;
  handleJoinRoom: (roomName: string, roomPassword?: string) => void;
}

export const RoomCard = ({ room, handleJoinRoom }: PropTypes) => {
  const roomPasswordRef = useRef<HTMLInputElement>(null);
  const player1 = room.player.find((player) => player.pos === 1);
  const player2 = room.player.find((player) => player.pos === 2);

  return (
    <Container key={room.name}>
      <Left>
        <RoomName>{`Room name: ${room.name}`}</RoomName>
        {/* <RoomAmount>{`Room amount: ${room.player.length}`}</RoomAmount> */}
        <RoomPlayers>
          <Player>{player1 ? player1.name : '---'}</Player>
          <Versus>vs</Versus>
          <Player>{player2 ? player2.name : '---'}</Player>
        </RoomPlayers>
      </Left>
      <Right>
        {room.havePassword && (
          <RoomPassword
            type="password"
            placeholder="Password"
            ref={roomPasswordRef}
          />
        )}
        <JoinButton
          onClick={() => {
            if (room.havePassword) {
              if (roomPasswordRef.current?.value === '') return; // better show error
              handleJoinRoom(room.name, roomPasswordRef.current?.value);
            }
            handleJoinRoom(room.name);
          }}
        >
          Join
        </JoinButton>
      </Right>
    </Container>
  );
};
