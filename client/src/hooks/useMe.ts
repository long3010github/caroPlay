import { useState, useEffect } from 'react';
import { RootState } from '../store';
import { useAppSelector } from '../store/hook';

export const useMe = () => {
  const userInfo = useAppSelector((state: RootState) => state.auth.userInfo);
};
