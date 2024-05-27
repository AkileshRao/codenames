import { createRandomEntity } from "../utils";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

type JoinRoomProps = {
  type: 'create' | 'join';
}

const JoinRoom = ({ type }: JoinRoomProps) => {
  const navigate = useNavigate();
  const { connect } = useSocket();
  const enterRoom = () => {
    const roomId: string = createRandomEntity('room');
    const userId: string = createRandomEntity('user');
    connect(userId, roomId);
    const rooms = localStorage.getItem('rooms');
    if (rooms) {
      const parsedRooms = JSON.parse(rooms);
      parsedRooms[roomId] = {
        roomId, userId
      }
      localStorage.setItem('rooms', JSON.stringify(parsedRooms))
    } else {
      localStorage.setItem('rooms', JSON.stringify({ [roomId]: { userId, roomId } }))
    }
    navigate(`/room/${roomId}`)
  }

  return (
    <div className="flex flex-col">
      <input type="text" placeholder="Enter room ID" className="p-3 rounded-md mb-2" />
      <button onClick={enterRoom}>{type === 'create' ? "Create" : "Join"} room</button>
    </div>
  )
}

export default JoinRoom