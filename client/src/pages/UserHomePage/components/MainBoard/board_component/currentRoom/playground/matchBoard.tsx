import React from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';
import {
  MatchState,
  setMatchStateAfterMove,
} from '../../../../../../../store/game/slice';
import { useAppDispatch } from '../../../../../../../store/hook';
import { OnGoingMatch } from '../../../interface/room.interface';
import { GameSquare } from './square';

const Board = styled.div`
  /* border: 1px solid black; */
  width: fit-content;

  /* height: 100%; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Column = styled.div`
  height: 40px;
  min-width: 500px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

interface PropTypes {
  currentMatch: OnGoingMatch;
  socket?: Socket;
}

export const GameBoard = ({ currentMatch, socket }: PropTypes) => {
  const dispatch = useAppDispatch();
  const { matchMoves } = currentMatch;

  const handleMove = (xIndex: number, yIndex: number) => {
    if (matchMoves[xIndex][yIndex]) return;
    socket?.emit('match_move', { xIndex, yIndex }, (success: boolean) => {
      if (!success) return false;
      // dispatch(
      //   setMatchStateAfterMove({
      //     player: 'long1235',
      //     coordinate: { xIndex, yIndex },
      //   })
      // );
    });
  };

  const gameBoard = matchMoves.map((column, colIndex) => {
    const colKey = colIndex;
    return (
      <Column key={`column${colKey}`}>
        {column.map((squareVal, squareIndex) => {
          const squareKey = `${colKey},${squareIndex}`;
          return (
            <GameSquare
              key={squareKey}
              xIndex={colIndex}
              yIndex={squareIndex}
              value={squareVal}
              handleMove={handleMove}
              isLastMove={
                currentMatch.lastMove
                  ? currentMatch.lastMove.xIndex === colIndex &&
                    currentMatch.lastMove.yIndex === squareIndex
                  : false
              }
            />
          );
        })}
      </Column>
    );
  });

  return <Board>{gameBoard}</Board>;
};
