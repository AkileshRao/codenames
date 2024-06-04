import React, { useEffect, useState } from 'react'
import TeamCard from './TeamCard'
import { useSocket } from '../state/SocketContext'
import Logs from './Logs';
import { getRoomFromLocalStorage, haveIJoinedTeam } from '../utils';
import useRoomStore, { RoomState } from '../state/roomStore';

const getRoomInfo = async (roomId: string) => {
    const response = await fetch(`http://localhost:3000/roomInfo/${roomId}`);
    return await response.json();
}
const ActiveRoom = ({ roomId }: { roomId: string }) => {
    const [teamRole, setTeamRole] = useState('');
    const { socket } = useSocket();
    const currentRoom = useRoomStore((state: RoomState) => state.currentRoom);
    const [playerJoined, setPlayerJoined] = useState(false);

    useEffect(() => {
        const joined = haveIJoinedTeam(roomId, currentRoom?.red, currentRoom?.blue);
        setPlayerJoined(joined);
    }, [roomId, currentRoom])


    const handleChangeRole = (role: string) => {
        setTeamRole(role);
    }

    const submitRole = () => {
        const [team, role] = teamRole.split('-');
        const room = getRoomFromLocalStorage(roomId);
        const messageObj = {
            playerId: room?.['playerId'],
            roomId, team, role
        }
        socket?.emit('join_team', messageObj);
        setPlayerJoined(true);
    }

    return (
        <div className='flex'>
            <div>
                <div>
                    <TeamCard team='red' members={[]} score={9} handleChangeRole={handleChangeRole} playerJoined={playerJoined} />
                    <TeamCard team='blue' members={[]} score={9} handleChangeRole={handleChangeRole} playerJoined={playerJoined} />
                    {!playerJoined && <button className='p-2 text-sm rounded-md w-full bg-stone-700' onClick={submitRole}>Ready</button>}
                </div>
                <div>
                    <Logs />
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default ActiveRoom