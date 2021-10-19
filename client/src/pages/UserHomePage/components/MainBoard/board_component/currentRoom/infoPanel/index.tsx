import React, { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';
import { RootState } from '../../../../../../../store';
import { ICurrentRoom } from '../../../../../../../store/game/slice';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../../../store/hook';
import {
  setActiveTimer,
  setTimerAfterTick,
} from '../../../../../../../store/timer/slice';

const RoomName = styled.div`
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  height: fit-content;
  margin-bottom: 30px;
`;

const RoomOwner = styled.div`
  text-align: center;
  font-size: 25px;
  height: fit-content;
  margin-bottom: 20px;
`;

const PlayerList = styled.div`
  height: fit-content;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const RoomPlayer = styled.div`
  height: fit-content;
  padding: 5px 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const JoinButton = styled.button`
  padding: 5px 15px;
  background: #e9e8eb;
  height: fit-content;
  width: fit-content;
  cursor: pointer;
  margin-left: 30px;

  :hover {
    background: #c0a9be;
  }
`;

const PlayerRow = styled.div`
  display: flex;
  justify-content: space-between;
  height: fit-content;
  width: fit-content;
`;

const PlayerLabel = styled.span`
  font-size: 25px;
  height: fit-content;
  width: fit-content;
`;

const PlayerName = styled.div`
  font-size: 25px;
  height: fit-content;
  width: fit-content;
  margin-left: 30px;
`;

const PlayerReadyState = styled.div`
  font-size: 25px;
  height: fit-content;
  width: fit-content;
  margin-right: 30px;
`;

const PlayerTurnTimer = styled.div`
  font-size: 25px;
  height: fit-content;
  width: fit-content;
  margin-right: 30px;
`;

const RoomViewerList = styled.div`
  height: fit-content;
  margin-bottom: 30px;
`;

const RoomViewerRow = styled.div`
  text-align: center;
  font-size: 25px;
  height: fit-content;
`;

const ReadyButton = styled.button`
  padding: 5px 10px;
  background: #e9e8eb;
  height: fit-content;
  width: fit-content;
  cursor: pointer;
  margin-bottom: 50px;

  :hover {
    background: #6da0af;
  }
`;

const LeaveButton = styled.button`
  padding: 5px 10px;
  background: #e9e8eb;
  height: fit-content;
  width: fit-content;
  cursor: pointer;
  margin-bottom: 50px;

  :hover {
    background: #6da0af;
  }
`;

const BeViewerButton = styled.button`
  padding: 5px 10px;
  background: #e9e8eb;
  height: fit-content;
  width: fit-content;
  cursor: pointer;
  margin-bottom: 50px;

  :hover {
    background: #6da0af;
  }
`;

interface PropTypes {
  currentRoom: ICurrentRoom;
  socket?: Socket;
}

export const RoomInfoPanel = ({ currentRoom, socket }: PropTypes) => {
  const dispatch = useAppDispatch();
  const { matchMove: matchMoveTimer } = useAppSelector(
    (state: RootState) => state.timer
  );
  const currentMatch = useAppSelector(
    (state: RootState) => state.game.currentMatch
  );
  const { me } = currentRoom;

  const handleRequestToBePlayer = (pos: number) => {
    socket?.emit('request_to_be_player', pos, (success: boolean) => {
      console.log(success);
    });
  };

  const handleRequestToBeViewer = () => {
    socket?.emit('request_to_be_viewer', (success: boolean) => {
      console.log(success);
    });
  };

  const handleChangeReadyStatus = () => {
    socket?.emit('ready_status_change', (success: boolean) => {
      console.log(success);
    });
  };

  const handleLeave = () => {
    socket?.emit('leave_room', (success: boolean) => {
      if (!success) return false;
    });
  };

  const playerList = Array(2)
    .fill(null)
    .map((val, index) => {
      const existPlayer = currentRoom.room.player.find(
        (player) => player.pos === index + 1
      );
      const key = `player${index}`;
      return (
        <RoomPlayer key={key}>
          <PlayerRow>
            <PlayerLabel>
              Player
              {` ${index + 1}`}
            </PlayerLabel>
            {existPlayer ? (
              <PlayerName>
                {existPlayer.name === me.name ? 'Me' : existPlayer.name}
              </PlayerName>
            ) : (
              <JoinButton onClick={() => handleRequestToBePlayer(index + 1)}>
                Be a player
              </JoinButton>
            )}
          </PlayerRow>
          {currentMatch ? (
            currentMatch.nextTurn === index + 1 && matchMoveTimer.isActive ? (
              <PlayerTurnTimer>{matchMoveTimer.time} </PlayerTurnTimer>
            ) : null
          ) : (
            <PlayerReadyState>
              {existPlayer && (existPlayer.isReady ? 'Ready' : 'Not ready')}
            </PlayerReadyState>
          )}
        </RoomPlayer>
      );
    });

  const viewerList = currentRoom.room.viewer.map((viewer) => (
    <RoomViewerRow key={viewer.name}>
      {viewer.name === me.name ? 'Me' : viewer.name}
    </RoomViewerRow>
  ));

  useEffect(() => {
    let matchMoveInterval: any;
    if (matchMoveTimer.isActive) {
      matchMoveInterval = setInterval(() => {
        dispatch(setTimerAfterTick('matchMove'));
      }, 1000);
    }
    return () => {
      if (matchMoveInterval) {
        clearInterval(matchMoveInterval);
      }
    };
  }, [matchMoveTimer.isActive]);

  return (
    <>
      <RoomName>{`Room: ${currentRoom.room.name}`}</RoomName>
      <PlayerList>{playerList}</PlayerList>
      {!currentMatch && 'pos' in me ? (
        <>
          <ReadyButton
            type="button"
            onClick={() => {
              handleChangeReadyStatus();
            }}
          >
            {me.isReady ? 'Not ready' : 'Ready'}
          </ReadyButton>
          <BeViewerButton
            onClick={() => {
              handleRequestToBeViewer();
            }}
          >
            Be a viewer
          </BeViewerButton>
        </>
      ) : null}
      <LeaveButton
        onClick={() => {
          handleLeave();
        }}
      >
        Leave
      </LeaveButton>
      <RoomViewerList>{viewerList}</RoomViewerList>
    </>
  );
};
