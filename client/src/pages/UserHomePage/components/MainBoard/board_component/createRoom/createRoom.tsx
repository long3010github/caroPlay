import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

import styled from 'styled-components';
import { socketHelper } from '../../../../../../helpers/socketHelper';
import { RootState } from '../../../../../../store';
import { setCurrentRoom } from '../../../../../../store/game/slice';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hook';
import { Player, Room } from '../../interface/room.interface';

const Container = styled.div`
  padding: 10px 10px;
  width: 40%;
  height: fit-content;
  /* border: 1px solid red; */
`;

const CreateRoomForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border: 1px solid black;
`;

const FormTitle = styled.div`
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const FormInputLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const InputLabel = styled.label`
  text-align: center;
  padding: 0px 15px;
  width: fit-content;
`;

const InputField = styled.input`
  height: 100%;
  width: 150px;
  padding: 2px 3px;
  margin-right: 15px;
`;

const SubmitButton = styled.button`
  height: fit-content;
  width: fit-content;
  padding: 5px 5px;
  margin-bottom: 20px;
`;

const ErrorState = styled.div`
  text-align: center;
  font-size: 20px;
  color: red;
  margin-bottom: 20px;
`;

interface PropTypes {
  socket?: Socket;
  // changeToRoom:
}

type CreateRoomResult =
  | {
      data: undefined;
      errorMessage: string;
    }
  | { errorMessage: undefined; data: Room };

export const CreateRoom = ({ socket }: PropTypes) => {
  const me = useAppSelector((state: RootState) => state.auth.userInfo);
  const dispatch = useAppDispatch();

  const roomNameRef = useRef<HTMLInputElement>(null);
  const roomPasswordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | undefined>();
  let isMounted = false;

  useEffect(() => {
    isMounted = true;
    return () => {
      isMounted = false;
    };
  });

  const handleCreateRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const roomName = roomNameRef.current?.value;
    const roomPassword = roomPasswordRef.current?.value;
    if (!roomName) setError('Enter room name first');
    else {
      socket?.emit(
        'create_room',
        { roomName, roomPassword },
        (result: CreateRoomResult) => {
          if (!isMounted) return;
          if (result.errorMessage) return setError(result.errorMessage);
          if (result.data) {
            const myRole = socketHelper.getMyRole(me, result.data);
            if (!myRole) return;
            dispatch(setCurrentRoom({ room: result.data, me: myRole }));
          }
        }
      );
    }
    setTimeout(() => {
      if (isMounted) setError(undefined);
    }, 3000);
  };
  return (
    <Container>
      <CreateRoomForm onSubmit={handleCreateRoom}>
        <FormTitle>Create new room</FormTitle>
        <FormInputLine>
          <InputLabel htmlFor="room_name">Room name:</InputLabel>
          <InputField type="text" ref={roomNameRef} />
        </FormInputLine>
        <FormInputLine>
          <InputLabel htmlFor="room_name">Room password:</InputLabel>
          <InputField type="password" ref={roomPasswordRef} />
        </FormInputLine>
        <SubmitButton>Create</SubmitButton>
        {error && <ErrorState>{error}</ErrorState>}
      </CreateRoomForm>
    </Container>
  );
};
