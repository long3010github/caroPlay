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
import { httpAdapter } from '../../adapter/http-request';
import { useApi } from '../../hooks/useApi';
import { useAppDispatch } from '../../store/hook';
import { hide } from '../../store/Modal/slice';

const UserHomePage = (): JSX.Element => (
  // const
  <OuterContainer>
    <Left>
      <TopLeft>
        <UserBriefInfo />
      </TopLeft>
      <BottomLeft>
        <MainBoard />
      </BottomLeft>
    </Left>
    <Right>
      <GlobalChat />
    </Right>
  </OuterContainer>
);
export default UserHomePage;
