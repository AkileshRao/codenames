import { createRandomEntity } from "../utils";
import { useSocket } from "../state/SocketContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const JoinRoom = () => {
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();
  const { connect } = useSocket();
  const enterRoom = () => {
    const roomId: string = createRandomEntity('room');
    const playerId: string = createRandomEntity('player');
    const connectionObj = {
      playerId,
      roomId,
      playerName,
    }
    connect(connectionObj);
    const rooms = localStorage.getItem('rooms');
    if (rooms) {
      const parsedRooms = JSON.parse(rooms);
      parsedRooms[roomId] = {
        roomId, playerId
      }
      localStorage.setItem('rooms', JSON.stringify(parsedRooms))
    } else {
      localStorage.setItem('rooms', JSON.stringify({ [roomId]: { playerId, roomId, playerName } }))
    }
    navigate(`/room/${roomId}`)
  }

  return (
    <div className="flex flex-col">
      <input type="text" placeholder="Enter player ID" value={playerName} onChange={e => setPlayerName(e.target.value)} className="p-3 rounded-md mb-2" />
      <button onClick={enterRoom}>Join room</button>
    </div>
  )
}

export default JoinRoom