import React, { useEffect, useState } from 'react';

import styled, { ThemeProvider } from 'styled-components';
import { useAppDispatch } from '../../../../../../../store/hook';

const Square = styled.div`
  border: 1px solid black;
  width: 40px;
  height: 100%;
  padding: 2px 2px;
  text-align: center;
  font-weight: bold;
  font-size: 30px;
  background: ${(props) => (props.theme.highLight ? '#d78ed4' : 'white')};

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
}

export const GameSquare = ({
  xIndex,
  yIndex,
  value,
  handleMove,
  isLastMove,
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
    <ThemeProvider theme={{ main: value, highLight: isHighlight }}>
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
