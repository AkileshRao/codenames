import { useEffect, useState } from "react"
import { useSocket } from "../state/SocketContext"
import { useParams } from "react-router-dom";
import { createRandomEntity, activeRoom } from "../utils";
import ActiveRoom from "../components/ActiveRoom";

const Room = () => {
    const [playerName, setPlayerName] = useState('');
    const { connect } = useSocket();
    const { roomId } = useParams();
    const [isNewMember, setIsNewMember] = useState(false);

    useEffect(() => {
        (async () => {
            const currentRoom = activeRoom(roomId!)
            currentRoom ? connect(currentRoom) : setIsNewMember(true);
        })()
    }, [])

    const enterRoom = () => {
        const playerId: string = createRandomEntity('player');
        connect({ playerId, roomId: roomId!, playerName });
        const rooms = localStorage.getItem('rooms');
        if (rooms) {
            const parsedRooms = JSON.parse(rooms);
            parsedRooms[roomId!] = { roomId, playerId, playerName }
            localStorage.setItem('rooms', JSON.stringify(parsedRooms))
        } else {
            localStorage.setItem('rooms', JSON.stringify({ [roomId!]: { playerId, roomId, playerName } }))
        }
        setIsNewMember(false);
    }

    if (isNewMember) {
        return (
            <div className="flex flex-col">
                <input type="text" placeholder="Enter player ID" value={playerName} onChange={e => setPlayerName(e.target.value)} className="p-3 rounded-md mb-2" />
                <button onClick={enterRoom}>Join {roomId}</button>
            </div>
        )
    }
    return (
        <ActiveRoom roomId={roomId!} />
    )
}

export default Room