import React, { useEffect, useState } from 'react';

import styled, { ThemeProvider } from 'styled-components';
import { useAppDispatch } from '../../../../../../../store/hook';

const Square = styled.div`
  border: 1px solid black;
  width: 35px;
  height: 35px;
  padding: 1px 1px;
  text-align: center;
  font-weight: bold;
  font-size: 30px;
  background: ${(props) => {
    if (props.theme.streak) return '#c96284';
    if (props.theme.highLight) return '#be9bbc';
  }};
  color: ${(props) => {
    if (props.theme.main === 1) return 'blue';
    if (props.theme.main === 0) return 'black';
  }};

  :hover {
    background: ${(props) => {
      if (!props.theme.main) return '#ccd3da';
    }};
    cursor: pointer;
  }
`;

interface PropTypes {
  xIndex: number;
  yIndex: number;
  value: 1 | 2 | null;
  handleMove: (xIndex: number, yIndex: number) => void;
  isLastMove: boolean;
  isStreak: boolean;
}

export const GameSquare = ({
  xIndex,
  yIndex,
  value,
  handleMove,
  isLastMove,
  isStreak,
}: PropTypes) => {
  const [isHighlight, setIsHighLight] = useState<boolean>(false);

  useEffect(() => {
    if (isLastMove) {
      // console.log(isHighlight);
      setIsHighLight(true);

      setTimeout(() => {
        setIsHighLight(false);
      }, 1000);
    }
  }, [value]);
  // const [isTicked, setIsTicked] = useState<boolean>(false);
  return (
    <ThemeProvider
      theme={{ main: value, highLight: isHighlight, streak: isStreak }}
    >
      <Square
        onClick={() => {
          if (value) return;
          handleMove(xIndex, yIndex);
        }}
      >
        {value && (value === 1 ? 'X' : 'O')}
      </Square>
    </ThemeProvider>
  );
};
