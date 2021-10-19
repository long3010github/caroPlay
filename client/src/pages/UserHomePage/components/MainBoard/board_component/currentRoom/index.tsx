import React, { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';
import { RootState } from '../../../../../../store';
import { ICurrentRoom } from '../../../../../../store/game/slice';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hook';
import {
  setActiveTimer,
  setTimerAfterTick,
} from '../../../../../../store/timer/slice';
import { RoomInfoPanel } from './infoPanel';
import { GameBoard } from './playground/matchBoard';

const Container = styled.div`
  padding: 10px 10px;
  border: 1px solid red;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /* justify-content: space-between; */
  height: 100%;
  width: 100%;
`;

const Left = styled.div`
  padding: 5px 5px;
  border: 1px solid yellowgreen;
`;

const Playground = styled.div`
  padding: 5px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Right = styled.div`
  padding: 5px 5px;
  border: 1px solid blue;
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: space-between; */
`;

interface PropTypes {
  socket?: Socket;
  currentRoom: ICurrentRoom;
}

export const CurrentRoom = ({ socket, currentRoom }: PropTypes) => {
  const dispatch = useAppDispatch();
  const { matchStart: matchStartTimer, matchMove: matchMoveTimer } =
    useAppSelector((state: RootState) => state.timer);
  const currentMatch = useAppSelector(
    (state: RootState) => state.game.currentMatch
  );

  useEffect(() => {
    let matchStartInterval: any;
    if (matchStartTimer.isActive) {
      matchStartInterval = setInterval(() => {
        dispatch(setTimerAfterTick('matchStart'));
      }, 1000);
    }
    return () => {
      if (matchStartInterval) clearInterval(matchStartInterval);
      if (matchStartTimer.isActive) {
        dispatch(setActiveTimer('matchMove'));
      }
    };
  }, [matchStartTimer.isActive]);

  return (
    <Container>
      <Left>
        <Playground>
          {matchStartTimer.isActive ? (
            <div>The match will begin after {matchStartTimer.time} second</div>
          ) : (
            currentMatch && (
              <GameBoard currentMatch={currentMatch} socket={socket} />
            )
          )}
        </Playground>
      </Left>
      <Right>
        <RoomInfoPanel currentRoom={currentRoom} socket={socket} />
      </Right>
    </Container>
  );
};
