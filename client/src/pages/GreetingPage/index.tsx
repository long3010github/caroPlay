import React, { useState } from 'react';
import styled from 'styled-components';
import { RootModal } from '../../containers/Modal';
import {
  Bg,
  Container,
  Left,
  Information,
  InnerContainer,
  Right,
} from './HomePageElement';
import { LoginForm } from './components/Form';

const GreetingPage = (): JSX.Element => (
  <Container>
    <Bg />
    <InnerContainer>
      <Left>
        <Information>Join us and wreak havoc</Information>
      </Left>
      <Right>
        <LoginForm />
      </Right>
    </InnerContainer>
    {/* <RootModal isOpen={isOpen} toggleClose={() => setIsOpen(false)} /> */}
  </Container>
);

export default GreetingPage;
