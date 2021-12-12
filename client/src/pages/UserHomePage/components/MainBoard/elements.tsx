import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';
import { CreateRoom } from './board_component/createRoom/createRoom';
import { RoomList } from './board_component/roomList/roomList';
// import { BoardContent } from './board_content';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
`;

const HeaderChoice = styled.div`
  text-align: center;
  padding: 5px 10px;
  font-size: 20px;
  height: fit-content;
  background: #ddd7d4;
  /* background: ; */
  border: 1px solid black;
  cursor: pointer;
`;

const BoardContent = styled.div`
  padding: 10px 10px;

  display: flex;
  justify-content: center;
`;

interface PropTypes {
  socket?: Socket;
}

export const BoardElement = ({ socket }: PropTypes) => {
  const [boardState, setBoardState] = useState<string>('roomList');

  let displayComponent;
  switch (boardState) {
    case 'roomList':
      displayComponent = <RoomList socket={socket} />;
      break;
    case 'createRoom':
      displayComponent = <CreateRoom socket={socket} />;
      break;
    default:
      displayComponent = <RoomList socket={socket} />;
  }

  return (
    <>
      <Header>
        <HeaderChoice
          onClick={() => {
            setBoardState('roomList');
          }}
        >
          Rooms
        </HeaderChoice>
        <HeaderChoice
          onClick={() => {
            setBoardState('createRoom');
          }}
        >
          Create room
        </HeaderChoice>
      </Header>
      {/* {isLoading ? (
        <div>Loading</div>
      ) : errorMessage ? (
        <div>{errorMessage}</div>
      ) : ( */}
      <BoardContent>{displayComponent}</BoardContent>
      {/* )} */}
    </>
  );
};
