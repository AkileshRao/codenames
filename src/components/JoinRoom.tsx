import { addRoomToLocalStorage, createRandomEntity } from "../utils";
import { useSocket } from "../state/SocketContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LocalStorageRoom } from "../types";

const JoinRoom = () => {
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();
  const { connect } = useSocket();

  const enterRoom = () => {
    const room: LocalStorageRoom = {
      playerId: createRandomEntity('player'),
      roomId: createRandomEntity('room'),
      playerName,
    }
    connect(room);  // <===== Socket connection
    addRoomToLocalStorage(room);
    navigate(`/room/${room.roomId}`);
  }

  return (
    <div className="flex flex-col">
      <input type="text" placeholder="Enter player ID" value={playerName} onChange={e => setPlayerName(e.target.value)} className="p-3 rounded-md mb-2" />
      <button onClick={enterRoom}>Join room</button>
    </div>
  )
}

export default JoinRoom