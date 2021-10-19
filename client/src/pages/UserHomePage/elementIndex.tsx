import React from 'react';
import styled from 'styled-components';

export const OuterContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 5px 10px 5px;
  z-index: 3;
  height: 92%;
`;

export const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TopLeft = styled.div`
  padding: 3px 5px;
  height: fit-content;
`;

export const BottomLeft = styled.div`
  padding: 2px 5px;
  height: 100%;
`;

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 450px;
`;
