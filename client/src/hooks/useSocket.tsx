import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAppDispatch } from '../store/hook';
import { setSocketInstance } from '../store/socket/slice';
import { IOType } from '../store/socket/ioType';
import { httpAdapter } from '../adapter/http-request';
import { Room } from '../pages/UserHomePage/components/MainBoard/board_component/roomList/room.interface';

export const useSocket = (ioType: IOType) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [data, setData] = useState<Room[]>([]);
  const [socket, setSocket] = useState<Socket | undefined>();
  const dispatch = useAppDispatch();

  const getIOConnection = () => {
    try {
      const ioInstance = io(
        `${process.env.REACT_APP_API || 'http://localhost:3000'}/game`,
        { withCredentials: true }
      );
      ioInstance.on('connect_error', () => {
        console.log('connect error');
        setErrorMessage(
          'Cant connect to server, trying to establish connection'
        );
      });
      ioInstance.on('connect', () => {
        console.log('connected');
        console.log(ioInstance.id);
        setIsLoading(false);
        setErrorMessage(undefined);
        // dispatch(setSocketInstance({ ioType, ioInstance }));
      });
      ioInstance.on('disconnect', () => {
        console.log('disconnected');
        console.log(ioInstance.id);
        setErrorMessage('Oops, something wrong');
      });

      ioInstance.on('connect_accept', () => {
        ioInstance.emit('fetch_rooms', (roomList: Room[]) => {
          console.log(roomList);
          setData(roomList);
        });
      });

      ioInstance.on('room_change', (room: Room, type: string) => {
        console.log(room);
        console.log(type);
        switch (type) {
          case 'new_room':
            setData((prevData) => prevData.concat(room));
            break;
          case 'remove_room':
            console.log(room);
            console.log(data);
            const index = data.findIndex(
              (roomData) => roomData.roomName === room.roomName
            );
            if (index >= 0) {
              data.splice(index, 1);
            }
            setData([...data]);
            break;
          default:
            console.log(room);
            console.log(type);
        }
      });
      return ioInstance;
    } catch (error: any) {
      console.log(error);
      // setHasError(true);
    }
    // setIsLoading(false); // fix here
  };

  useEffect(() => {
    const ioInstance = getIOConnection();
    setSocket(ioInstance);
    return () => {
      console.log(ioInstance);
      ioInstance?.disconnect();
      // setSocket(undefined);
    };
  }, []);

  return { isLoading, errorMessage, data, socket };
};
