import styled from 'styled-components';

export const Container = styled.div`
  width: 300px;
  height: 200px;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const Header = styled.div`
  /* padding: 10px 10px; */
  font-size: 30px;
  font-weight: bold;
  color: white;
  height: fit-content;
`;

export const Content = styled.div`
  margin-bottom: 30px;
  color: white;
  font-size: 25px;
  text-align: center;
  height: fit-content;
`;
