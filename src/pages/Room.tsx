import { useEffect, useState } from "react"
import { useSocket } from "../context/SocketContext"
import { useNavigate, useParams } from "react-router-dom";
import { createRandomEntity } from "../utils";

const getRoomInfo = async (roomId: string) => {
    const response = await fetch(`http://localhost:3000/roomInfo/${roomId}`)
    return await response.json();
}

const Room = () => {
    const { connect } = useSocket();
    const { roomId } = useParams();
    const [isNewMember, setIsNewMember] = useState(false);
    // const { socket } = useSocket();
    useEffect(() => {
        (async () => {
            const room = await getRoomInfo(roomId as string);
            const storedRooms = localStorage.getItem('rooms');
            const parsedRooms = storedRooms && JSON.parse(storedRooms);
            if (parsedRooms?.[roomId as string]) {
                const currentRoom = parsedRooms[roomId as string]
                connect(currentRoom.userId, currentRoom.roomId);
            } else {
                setIsNewMember(true);
            }
        })()
    }, [])

    const enterRoom = () => {
        const userId: string = createRandomEntity('user');
        connect(userId, roomId!);
        const rooms = localStorage.getItem('rooms');
        if (rooms) {
            const parsedRooms = JSON.parse(rooms);
            parsedRooms[roomId!] = {
                roomId, userId
            }
            localStorage.setItem('rooms', JSON.stringify(parsedRooms))
        } else {
            localStorage.setItem('rooms', JSON.stringify({ [roomId!]: { userId, roomId } }))
        }
        setIsNewMember(false);
    }

    if (isNewMember) {
        return (
            <div className="flex flex-col">
                <input type="text" placeholder="Enter room ID" className="p-3 rounded-md mb-2" />
                <button onClick={enterRoom}>Join room</button>
            </div>
        )
    }
    return (
        <div>
            Room
        </div>
    )
}

export default Room