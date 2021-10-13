import React from 'react';
import {
  Messages,
  ChatForm,
  ChatMessage,
  Container,
  Input,
  Header,
  SubmitButton,
} from './elements';

export const GlobalChat = (): JSX.Element => (
  <Container>
    <Header>Global</Header>
    <Messages>
      <ChatMessage>abc</ChatMessage>
    </Messages>
    <ChatForm>
      <Input type="text" />
      <SubmitButton type="submit">Submit</SubmitButton>
    </ChatForm>
  </Container>
);
