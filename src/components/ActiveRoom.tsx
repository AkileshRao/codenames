import React, { useEffect, useState } from 'react'
import TeamCard from './TeamCard'
import { useSocket } from '../state/SocketContext'
import Logs from './Logs';

const ActiveRoom = ({ roomId }: { roomId: string }) => {
    const [teamRole, setTeamRole] = useState('');
    const { socket } = useSocket();

    useEffect(() => {
        socket?.on('room_updated', (room) => {
            console.log(room);
        });
    })
    const handleChangeRole = (role: string) => {
        console.log(role);
        setTeamRole(role);
    }

    const submitRole = () => {
        const rooms = JSON.parse(localStorage.getItem('rooms')!);
        socket?.emit('join_team', teamRole, roomId, { playerId: rooms[roomId]['playerId'], playerName: rooms[roomId]['playerName'] })
    }

    return (
        <div>
            <div>
                <div>
                    <TeamCard team='red' members={[]} score={9} handleChangeRole={handleChangeRole} />
                    <TeamCard team='blue' members={[]} score={9} handleChangeRole={handleChangeRole} />
                    <button className='p-2 text-sm rounded-md w-full bg-stone-700' onClick={submitRole}>Ready</button>
                </div>
                <div>
                    <Logs />
                </div>
            </div>
            <div>
                cards
            </div>
        </div>
    )
}

export default ActiveRoom