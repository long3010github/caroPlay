import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { ThemeProvider } from 'styled-components';
import { RootState } from '../../../../store';
import { addMessage } from '../../../../store/chat/slice';
import { useAppDispatch, useAppSelector } from '../../../../store/hook';
import {
  Messages,
  ChatForm,
  ChatMessage,
  Container,
  Input,
  Header,
  HeaderChoice,
  SubmitButton,
  SenderAndTime,
  Sender,
  Time,
  Content,
  Leaderboards,
  LeaderboardsItem,
  Win,
  Place,
  Info,
  Name,
  Statistic,
  WinRate,
} from './elements';

interface PropTypes {
  socket: Socket | undefined;
}

export const GlobalChat = ({ socket }: PropTypes): JSX.Element => {
  const messages = useAppSelector((state: RootState) => state.chat.messages);
  const me = useAppSelector(
    (state: RootState) => state.auth.userInfo?.username
  );
  const [input, setInput] = useState('');
  const [display, setDisplay] = useState(true);
  const leaderboard = useAppSelector((state: RootState) => state.leaderBoards);
  const dispatch = useAppDispatch();

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    socket?.emit('global_chat', {
      sender: me,
      content: input,
    });
    setInput('');
  };

  return (
    <Container>
      <Header>
        <ThemeProvider theme={{ isSelected: display }}>
          <HeaderChoice
            onClick={() => {
              setDisplay(true);
            }}
          >
            Chat
          </HeaderChoice>
        </ThemeProvider>
        <ThemeProvider theme={{ isSelected: !display }}>
          <HeaderChoice
            onClick={() => {
              setDisplay(false);
            }}
          >
            Leaderboards
          </HeaderChoice>
        </ThemeProvider>
      </Header>
      {display ? (
        <>
          <Messages>
            {messages.map((message) => (
              <ThemeProvider theme={{ isMyMessage: me === message.sender }}>
                <ChatMessage key={message.time}>
                  <SenderAndTime>
                    <Sender>{message.sender}</Sender>
                    <Time>
                      {new Date(message.time).toTimeString().split(' ')[0]}
                    </Time>
                  </SenderAndTime>
                  <Content>{message.content}</Content>
                </ChatMessage>
              </ThemeProvider>
            ))}
          </Messages>
          <ChatForm onSubmit={handleSendMessage}>
            <Input
              type="text"
              onChange={(event) => {
                setInput(event.target.value);
              }}
              value={input}
            />
            <SubmitButton type="submit">Send</SubmitButton>
          </ChatForm>
        </>
      ) : (
        <Leaderboards>
          {leaderboard.map((item, index) => {
            const winRate =
              item.win + item.lose === 0
                ? 0
                : (
                    Math.round(
                      (item.win / (item.win + item.lose)) * 100 * 100
                    ) / 100
                  ).toFixed(2);
            return (
              <LeaderboardsItem key={item.username}>
                <ThemeProvider theme={{ place: index + 1 }}>
                  <Place>{index + 1}</Place>
                </ThemeProvider>
                <Info>
                  <Name>{item.username}</Name>
                  <Statistic>
                    <Win>{`Win: ${item.win}`}</Win>
                    <WinRate>{`Win rate: ${winRate}%`}</WinRate>
                  </Statistic>
                </Info>
              </LeaderboardsItem>
            );
          })}
        </Leaderboards>
      )}
    </Container>
  );
};
