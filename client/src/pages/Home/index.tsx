import React from 'react';
import { RootState } from '../../store';
import { useAppSelector } from '../../store/hook';
import GreetingPage from '../GreetingPage';
import UserPage from '../UserHomePage';

export const Home = () => {
  const { isAuth } = useAppSelector((state: RootState) => state.auth);
  return !isAuth ? <GreetingPage /> : <UserPage />;
};
