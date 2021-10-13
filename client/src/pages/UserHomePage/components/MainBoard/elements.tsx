import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
`;

export const HeaderChoice = styled.div`
  text-align: center;
  padding: 5px 10px;
  font-size: 20px;
  height: fit-content;
  background: #ddd7d4;
  /* background: ; */
  border: 1px solid black;
  cursor: pointer;
`;

export const RoomContainer = styled.div`
  padding: 10px 10px;
  border: 1px solid red;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;

export const Left = styled.div`
  padding: 5px 5px;
  border: 1px solid yellowgreen;
`;

export const Right = styled.div`
  padding: 5px 5px;
  border: 1px solid blue;
`;

export const BoardContainer = styled.div``;
