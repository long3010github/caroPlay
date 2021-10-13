import React, { useState } from 'react';
import { useSocket } from '../../../../hooks/useSocket';
import { CreateRoom } from './board_component/createRoom/createRoom';
import { RoomList } from './board_component/roomList/roomList';
import { BoardContent } from './board_content';
import {
  Container,
  Header,
  HeaderChoice,
  Left,
  Right,
  RoomContainer,
} from './elements';

export const MainBoard = (): JSX.Element => {
  const { isLoading, errorMessage, data: roomList, socket } = useSocket('game');
  const [boardState, setBoardState] = useState<string>('roomList');
  const [isInRoom, setIsInRoom] = useState<boolean>(false);
  // const

  let displayComponent;
  switch (boardState) {
    case 'roomList':
      displayComponent = <RoomList roomList={roomList} socket={socket} />;
      break;
    case 'createRoom':
      displayComponent = <CreateRoom socket={socket} />;
      break;
    default:
      displayComponent = <RoomList roomList={roomList} socket={socket} />;
  }
  return (
    <Container>
      {isInRoom ? (
        <RoomContainer>
          <Left />
          <Right />
        </RoomContainer>
      ) : (
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
          {isLoading ? (
            <div>Loading</div>
          ) : errorMessage ? (
            <div>{errorMessage}</div>
          ) : (
            <BoardContent>{displayComponent}</BoardContent>
          )}
        </>
      )}
    </Container>
  );
};
