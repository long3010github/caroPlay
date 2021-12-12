import React from 'react';
import {
  OuterContainer,
  Left,
  Right,
  TopLeft,
  BottomLeft,
} from './elementIndex';
import { GlobalChat } from './components/GlobalChat';
import { MainBoard } from './components/MainBoard';
import { UserBriefInfo } from './components/UserBriefInfo';
import { useSocket } from '../../hooks/useSocket';

const UserHomePage = (): JSX.Element => {
  const { isLoading, errorMessage, socket } = useSocket('game');
  if (isLoading) return <div>Loading</div>;
  if (errorMessage) return <div>{errorMessage}</div>;
  return (
    // const
    <OuterContainer>
      <Left>
        <TopLeft>
          <UserBriefInfo />
        </TopLeft>
        <BottomLeft>
          <MainBoard socket={socket} />
        </BottomLeft>
      </Left>
      <Right>
        <GlobalChat socket={socket} />
      </Right>
    </OuterContainer>
  );
};
export default UserHomePage;
