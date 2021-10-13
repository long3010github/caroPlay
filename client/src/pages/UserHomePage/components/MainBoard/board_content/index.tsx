import React from 'react';
import styled from 'styled-components';
import { JsxEmit } from 'typescript';
import { CreateRoom } from '../board_component/createRoom/createRoom';
import { RoomList } from '../board_component/roomList/roomList';

const Container = styled.div`
  padding: 10px 10px;

  display: flex;
  /* align-items: center; */
  justify-content: center;
`;

interface PropTypes {
  children: JSX.Element;
}

export const BoardContent = ({ children }: PropTypes) => (
  <Container>{children}</Container>
);

// interface PropTypes {
//   componentName: string;
// }

// export const BoardContent = ({ componentName }: PropTypes) => {
//   let child;
//   switch (componentName) {
//     case 'roomList':
//       child = (
//         <RoomList
//           roomList={[
//             { roomName: 'room1', roomAmount: 'dawe', havePassword: true },
//           ]}
//         />
//       );
//       break;
//     case 'createRoom':
//       child = <CreateRoom />;
//       break;
//     default:
//       child = <RoomList roomList={[]} />;
//   }
//   return <Container>{child}</Container>;
// };
