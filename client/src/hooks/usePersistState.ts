import React from 'react';
import { RootState } from '../store';
import { useAppSelector } from '../store/hook';

type StateType = 'auth';

export const usePersistState = (type: StateType) => {
  const selectState =
    useAppSelector((state: RootState) => state[type]) ||
    localStorage.getItem('auth');
  return selectState;
};
