import React, { useEffect, useState } from 'react'
import TeamCard from './TeamCard'
import { useSocket } from '../state/SocketContext'
import Logs from './Logs';
import { getRoomFromLocalStorage, haveIJoinedTeam } from '../utils';
import useRoomStore, { RoomState } from '../state/roomStore';
import Cards from './Cards';
import { Member, Player } from '../types';

const getRoomInfo = async (roomId: string) => {
    const response = await fetch(`http://localhost:3000/roomInfo/${roomId}`);
    return await response.json();
}
const ActiveRoom = ({ roomId }: { roomId: string }) => {
    const [teamRole, setTeamRole] = useState('');
    const { socket, setSocket } = useSocket();
    const currentRoom = useRoomStore((state: RoomState) => state.currentRoom);
    const [playerJoined, setPlayerJoined] = useState(false);

    console.log(currentRoom);

    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                console.log("Socket disconnecting");
            }
        };
    }, [socket]);

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
            playerId: room?.playerId,
            playerName: room?.playerName,
            roomId, team, role
        }
        socket?.emit('join_team', messageObj);
        setPlayerJoined(true);
    }

    const teamMembers = (team: 'red' | 'blue') => {
        let teamMembers = [];
        if (currentRoom?.[team].sm) teamMembers.push(currentRoom?.[team].sm);
        if (currentRoom?.[team].ops) teamMembers = [...teamMembers, ...currentRoom?.[team].ops];
        return teamMembers;
    }

    const startGame = () => {
        if (!currentRoom?.red.sm || !currentRoom.blue.sm) {
            console.log("Both teams need a spymaster")
        } else {
            socket?.emit('start_game', roomId);
        }
    }

    return (
        <div className='flex gap-4 items-start '>
            <div className='flex flex-col'>
                <TeamCard
                    team='red'
                    score={currentRoom?.red.score!}
                    handleChangeRole={handleChangeRole}
                    playerJoined={playerJoined}
                    members={teamMembers('red') as Array<Member>}
                // {...(doesRoomHaveMembers('red'))}
                />
                <TeamCard
                    team='blue'
                    score={currentRoom?.blue.score!}
                    handleChangeRole={handleChangeRole}
                    playerJoined={playerJoined}
                    members={teamMembers('blue') as Array<Member>}
                />
                <Logs />
                {!playerJoined && <button className='p-2 text-sm rounded-md w-full bg-stone-700' onClick={submitRole}>Ready</button>}
            </div>
            <div>
                {playerJoined && <Cards />}
                <button className='bg-blue-700 font-bold mt-4 p-2 px-4 rounded' onClick={startGame}>Start game</button>
            </div>
        </div>
    )
}

export default ActiveRoom