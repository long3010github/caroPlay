import React from 'react';
import { RootState } from '../../../../store';
import { useAppSelector } from '../../../../store/hook';
import { Container, Left, Right, Username, Win, Lose } from './elements';
import avatar from '../../../../assets/profile.jpg';

export const UserBriefInfo = (): JSX.Element => {
  const { userInfo } = useAppSelector((state: RootState) => state.auth);
  if (!userInfo) return <div>No user info</div>;
  return (
    <Container>
      <Left src={avatar} />
      <Right>
        <Username>{userInfo.username}</Username>
        <Win>{`Win: ${userInfo.win}`}</Win>
        <Lose>{`Lose: ${userInfo.lose}`}</Lose>
      </Right>
    </Container>
  );
};
