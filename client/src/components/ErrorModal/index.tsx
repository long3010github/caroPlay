import React from 'react';
import { Container, Content, Header } from './element';

interface PropTypes {
  errorMessage?: string;
}

export const ErrorModal = ({ errorMessage }: PropTypes) => (
  <Container>
    <Header>Oops</Header>
    <Content>{errorMessage}</Content>
  </Container>
);
