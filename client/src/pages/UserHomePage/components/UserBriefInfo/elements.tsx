import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 22px;
  border: 1px solid black;
  height: fit-content;
  max-width: fit-content;
  background: lightgray;
`;

export const Left = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 50px;
`;

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-size: 25px;
  margin-left: 30px;
`;

export const Username = styled.div`
  text-align: left;
`;

export const Win = styled.div`
  text-align: left;
`;

export const Lose = styled.div`
  text-align: left;
`;
