import React from 'react';
import styled from 'styled-components';

export const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: fit-content;
  height: fit-content;
  transform: translate(-50%, -50%);
  /* padding: 100px; */
  z-index: 1000;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: #0e0b0b;
  border-radius: 20px;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(146, 125, 125, 0.8);
  z-index: 100;
`;

export const ModalHeader = styled.div`
  padding: 2px 3px;
  width: 100%;
  display: flex;
  direction: rtl;
`;

export const CloseButton = styled.button`
  font-size: 25px;
  font-weight: bold;
  margin-right: 10px;
  margin-top: 10px;
  width: 10px;
  /* background: 0b0b; */
  background: #0e0b0b;
  color: white;
  border: none;
`;

export const None = styled.div`
  display: none;
`;
