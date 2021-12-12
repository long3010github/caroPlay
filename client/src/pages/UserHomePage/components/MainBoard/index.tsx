import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '../../../../hooks/useSocket';
import { RootState } from '../../../../store';
import { useAppSelector } from '../../../../store/hook';
import { CurrentRoom } from './board_component/currentRoom';
import { BoardElement, Container } from './elements';

interface PropTypes {
  socket: Socket | undefined;
}

export const MainBoard = ({ socket }: PropTypes): JSX.Element => {
  // const { isLoading, errorMessage, socket } = useSocket('game');
  const currentRoom = useAppSelector(
    (state: RootState) => state.game.currentRoom
  );

  return (
    <Container>
      {currentRoom && socket ? (
        <CurrentRoom socket={socket} currentRoom={currentRoom} />
      ) : (
        <BoardElement
          // isLoading={isLoading}
          // errorMessage={errorMessage}
          socket={socket}
        />
      )}
    </Container>
  );
};
