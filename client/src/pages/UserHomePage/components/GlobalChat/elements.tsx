import React from 'react';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px 5px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  height: fit-content;
`;

export const HeaderChoice = styled.div`
  text-align: center;
  height: fit-content;
  font-size: 20px;
  font-weight: bold;
  border: 1px solid black;

  background-color: ${(props) => {
    if (props.theme.isSelected) return '#c0a9ba';
    return 'white';
  }};
  :hover {
    background-color: #9c7272;
  }
  cursor: pointer;
`;

export const Leaderboards = styled.div`
  margin-top: 2px;
  display: flex;
  flex-direction: column;
  border: 1px solid black;

  overflow-y: auto;
  height: 100%;
  /* height: 100%; */
`;

export const LeaderboardsItem = styled.div`
  display: flex;
  /* flex-direction: column; */
  width: 100%;
  padding: 6px 5px;
  height: fit-content;
  border-bottom: 1px solid black;
  font-size: 20px;
  /* margin-bottom: 5px; */
`;

export const Place = styled.div`
  /* padding: 5px 5px; */
  text-align: center;
  font-size: 25px;
  height: 40px;
  width: 58px;
  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid black;
  border-radius: 50%;
  margin-right: 30px;

  background-color: ${(props) => {
    switch (props.theme.place) {
      case 1:
        return '#d1c35d';
      case 2:
        return '#bdbbad';
      case 3:
        return '#c99556';
      default:
        return 'white';
    }
  }};
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  /* width: 100%; */
`;

export const Name = styled.div`
  margin-bottom: 5px;
`;

export const Statistic = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: space-evenly; */
`;

export const Win = styled.div`
  width: 80px;
`;

export const WinRate = styled.div`
  margin-left: 5px;
  width: fit-content;
`;

export const Messages = styled.div`
  margin-top: 2px;
  display: flex;
  flex-direction: column-reverse;
  border: 1px solid black;

  overflow-y: auto;
  height: 100%;
  /* height: 100%; */
`;

export const ChatMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 10px;
  height: fit-content;
  border-top: 1px solid black;
`;

export const SenderAndTime = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  height: fit-content;
`;

export const Sender = styled.div`
  font-weight: bold;
  text-align: left;
  margin-left: 3px;
  margin-right: 3px;
  width: fit-content;
  height: fit-content;
  display: ${(props) => props.theme.isMyMessage && 'none'};
`;

export const Time = styled.div`
  font-style: italic;
  width: fit-content;
  height: fit-content;
  margin-left: auto;
  margin-right: 0;
`;

export const Content = styled.div`
  margin-right: ${(props) => (props.theme.isMyMessage ? '5px' : 'auto')};
  margin-left: ${(props) => (props.theme.isMyMessage ? 'auto' : '5px')};
  height: fit-content;
  width: fit-content;
  padding: 5px 5px;
  background-color: #d1c5c5;
  border-radius: ${(props) => {
    if (props.theme.isMyMessage) return '10px 3px 10px 10px';
    return '3px 10px 10px 10px';
  }};
  display: block;
  max-width: 200px;
  overflow-wrap: break-word;
`;

export const ChatForm = styled.form`
  display: flex;
  height: fit-content;
  margin-top: 2px;
`;

export const Input = styled.input`
  border: 1px solid black;
  height: 35px;
  padding: 5px 5px;
  /* width: 70%; */

  :focus {
    outline: tomato;
    border: 2px solid blueviolet;
  }
`;

export const SubmitButton = styled.button`
  background: #afb3b9;
  height: 35px;
  padding: 5px 5px;
  cursor: pointer;
  width: 50%;

  :hover {
    background: #c5abb9;
  }
`;
