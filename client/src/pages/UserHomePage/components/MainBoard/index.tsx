import React, { useState } from 'react';
import { useSocket } from '../../../../hooks/useSocket';
import { RootState } from '../../../../store';
import { useAppSelector } from '../../../../store/hook';
import { CurrentRoom } from './board_component/currentRoom';
import { BoardElement, Container } from './elements';

export const MainBoard = (): JSX.Element => {
  const { isLoading, errorMessage, socket } = useSocket('game');
  const currentRoom = useAppSelector(
    (state: RootState) => state.game.currentRoom
  );

  return (
    <Container>
      {currentRoom && socket && !isLoading && !errorMessage ? (
        <CurrentRoom socket={socket} currentRoom={currentRoom} />
      ) : (
        <BoardElement
          isLoading={isLoading}
          errorMessage={errorMessage}
          socket={socket}
        />
      )}
    </Container>
  );
};
