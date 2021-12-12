import { useState, useEffect } from 'react';
import { RootState } from '../store';
import { useAppSelector } from '../store/hook';

export const useGame = () => {
  const { roomList, currentRoom, currentMatch } = useAppSelector(
    (state: RootState) => state.game
  );
  return { roomList, currentMatch, currentRoom };
};
