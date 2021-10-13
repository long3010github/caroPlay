import React from 'react';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px 5px;
`;

export const Header = styled.div`
  text-align: center;
  height: fit-content;
  font-size: 30px;
  font-weight: bold;
  border: 1px solid black;
`;

export const Messages = styled.div`
  margin-top: 2px;
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  /* height: 100%; */
`;

export const ChatMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 10px;
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
