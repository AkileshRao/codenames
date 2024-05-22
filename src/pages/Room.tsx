import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Socket, io } from 'socket.io-client';

const Room = () => {
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [availableRooms, setAvailableRooms] = useState<string[]>([]);
    const { roomId } = useParams();
    const [name, setName] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);

    const joinRoom = (optionalRoomId?: string, optionalName?: string) => {
        const newSocket = io("http://localhost:3000", {
            query: {
                roomId: optionalRoomId ?? roomId,
                name: optionalName ?? name,
            }
        })
        newSocket?.on("connect", () => {
            Cookies.set('socketId', newSocket.id as string, { expires: 1 })
            const roomAndUserData = {
                roomId: optionalRoomId ?? roomId,
                userId: newSocket.id,
                userName: optionalName ?? name,
            }
            localStorage.setItem('room', JSON.stringify(roomAndUserData))
            setName('');
        })

        newSocket.on("hello", () => {
            console.log("Hmmm go a hello");
        })
        setSocket(newSocket);
    }

    const test = () => {
        socket?.emit('dummy');
        console.log(socket)
    }

    useEffect(() => {
        const room = localStorage.getItem('room');
        if (room && Cookies.get('socketId')) {
            const { roomId, userName } = JSON.parse(room);
            joinRoom(roomId, userName);
        }
    }, [])

    useEffect(() => {
        async function getRooms() {
            setRoomsLoading(true);
            const res = await fetch('http://localhost:3000/rooms');
            const { rooms } = await res.json();
            setAvailableRooms(rooms);
            setRoomsLoading(false);
        }
        getRooms()
    }, [])

    if (roomsLoading) {
        return (<div>Loading rooms...</div>)
    }

    if (availableRooms.indexOf(roomId as string) < 0) {
        return (
            <div>
                <p>Could not find room!</p>
                <Link to="/">Go back to homepage</Link>
            </div>
        )
    }

    const room = localStorage.getItem('room');
    if (room && JSON.parse(room).roomId == roomId) {
        return (
            <div>
                <p>Room {JSON.parse(room).roomId}</p>
                <button onClick={test}>Broadcast a message</button>
            </div>
        )
    } else {
        return (
            <div>
                <input
                    type="text"
                    placeholder='Enter your name'
                    className='p-2 me-3 text-xl rounded'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <button onClick={() => joinRoom()}>Join room</button>
            </div>
        )
    }


}

export default Room