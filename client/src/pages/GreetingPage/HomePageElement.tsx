import React from 'react';
import styled from 'styled-components';
import landingBg from '../../assets/bg.jpg';

export const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 3;
`;

export const Bg = styled.div`
  background-image: url(${landingBg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
  margin-top: -10px;
  /* z-index: 10; */
  filter: blur(8px);
`;

export const InnerContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  padding: 60px 10%;
  opacity: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 1000px) {
    flex-direction: column;
    justify-content: center;
  }
`;

export const Left = styled.div`
  @media screen and (max-width: 1000px) {
    text-align: center;
    height: 150px;
    margin-bottom: 20px;
  }
`;

export const Information = styled.div`
  font-size: 40px;
  color: #ffffff;
  font-weight: bold;
  max-height: 60px;
`;

export const Right = styled.div`
  display: flex;
  justify-content: center;
`;
