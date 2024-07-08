import React from "react";
import { createRandomEntity } from "../utils/room";
import { useSocket } from "../state/SocketContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LocalStorageRoom } from "../types";
import { useParams } from "react-router-dom";
import { upsertLocalStorageRoom } from "../utils/localStorage";
import { Button, Input } from "./ui";

const JoinRoom = ({ hasUserJoinedExistingRoom }: { hasUserJoinedExistingRoom?: (state: boolean) => void }) => {
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();
  const { connect } = useSocket();
  const { roomId } = useParams();

  const enterRoom = () => {
    const room: LocalStorageRoom = {
      playerId: createRandomEntity('player'),
      roomId: roomId ?? createRandomEntity('room'),
      playerName,
    }
    connect(room);  // <===== Socket connection
    upsertLocalStorageRoom(room);
    navigate(`/room/${room.roomId}`);

    //When a user is trying to join a specific room, the navigate method won't work 
    //because the user would already be on the room/roomId route.
    //To trigger a rerender inside the ActiveRoom component, we use this callback function
    if (roomId) { hasUserJoinedExistingRoom?.(true) }
  }

  return (
    <div className={`flex flex-col items-center justify-center tracking-tight font-geist`}>
      <h1 className="text-6xl font-bold text-white mb-2">Welcome to <span className="bg-gradient-to-r from-orange-700 to-indigo-700 bg-clip-text text-transparent">Codenames!</span></h1>
      <p className="text-2xl font-light opacity-50 text-white mb-10">Enter your player name to get started.</p>
      <Input type="text" className='w-1/2 text-xl h-12 mb-4' placeholder="Player ID" value={playerName} onChange={e => setPlayerName(e.target.value)} />
      <Button className="w-1/2 text-xl font-medium hover:bg-gradient-to-r hover:from-orange-700 hover:to-indigo-700 hover:text-foreground transition duration-200" size={"lg"} onClick={enterRoom}>Join room {roomId ? roomId.split("_")[1] : ''}</Button>
    </div>
  )
}

export default JoinRoom