import { useCallback, useEffect, useState } from 'react'
import TeamCard from './TeamCard'
import { useSocket } from '../state/SocketContext'
import Logs from './Logs';
import { getRoomFromLocalStorage, haveIJoinedTeam } from '../utils';
import useRoomStore, { RoomState } from '../state/roomStore';
import Cards from './Cards';
import { LocalStorageRoom, Member } from '../types';
import React from 'react';

const ActiveRoom = ({ roomId }: { roomId: string }) => {
    const [teamRole, setTeamRole] = useState('');
    const { socket, setSocket } = useSocket();
    const currentRoom = useRoomStore((state: RoomState) => state.currentRoom);
    const [playerJoined, setPlayerJoined] = useState(false);
    const [clueMessage, setClueMessage] = useState('');
    const [clueWords, setClueWords] = useState(0);
    const [localStorageRoom, setLocalStorageRoom] = useState<LocalStorageRoom | null>(null);
    console.log("ACTIVE ROOM", currentRoom)

    useEffect(() => {
        setLocalStorageRoom(getRoomFromLocalStorage(roomId));
    }, [roomId])
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
        console.log(currentRoom)
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
        let teamMembers: Member[] = [];
        if (currentRoom?.[team].sm) teamMembers.push(currentRoom?.[team].sm!);
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

    const roomStateMessage = () => {
        const { team, state } = currentRoom?.currentTurn!;
        if (state === 'giveClue') return `Team ${team}'s spymaster is giving the clue`;
        if (state === 'guess') return `Team ${team}'s turn to guess`;
    }

    const giveClue = () => {
        if (clueMessage === '' || clueWords === 0) {
            console.log("Invalid clue message or invalid word count!")
        } else {
            socket?.emit('give_clue', localStorageRoom?.playerName, {
                clue: clueMessage,
                team: currentRoom?.currentTurn?.team,
                state: 'guess',
                wordsAllowedToGuess: clueWords
            })
        }
    }

    const isSM = useCallback(() => {
        const room = getRoomFromLocalStorage(roomId);
        const spymasters = [currentRoom?.blue.sm?.playerId, currentRoom?.red.sm?.playerId];
        return spymasters.indexOf(room?.playerId) >= 0;
    }, [currentRoom])

    const isSMFromATeam = () => {
        const { team, state } = currentRoom?.currentTurn!;
        const currentTurnSM = currentRoom?.[team as 'red' | 'blue'].sm?.playerId;
        const playerId = localStorageRoom?.playerId!;
        if (isSM() && state === 'giveClue' && currentTurnSM === playerId) {
            return true;
        }
        return false;
    }

    const resetGame = () => {
        socket?.emit('reset_game', roomId);
    }

    if (currentRoom?.winner) {
        return <div>
            <h2>Team {currentRoom.winner.team} won</h2>
            <p>{currentRoom.winner.reason}</p>
            <button onClick={resetGame}>Reset game</button>
        </div>
    }
    return (
        <div className='font-geist dark h-screen w-screen bg-zinc-950 p-4'>
            <p className='text-2xl font-bold text-white mb-2'>{localStorageRoom?.playerName}</p>
            <div className={`flex gap-4 items-start ${currentRoom?.currentTurn?.team === 'red' ? 'bg-red-500' : (currentRoom?.currentTurn?.team === 'blue' ? 'bg-blue-500' : '')}`}>
                <div className='flex flex-col'>
                    <TeamCard
                        team='red'
                        score={currentRoom?.red.score!}
                        handleChangeRole={handleChangeRole}
                        playerJoined={playerJoined}
                        members={teamMembers('red') as Array<Member>}
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
                    {playerJoined && <Cards currentRoom={currentRoom} roomId={roomId} isSM={isSM()} />}
                    {(!currentRoom?.hasGameStarted && playerJoined) && <button className='bg-blue-700 font-bold mt-4 p-2 px-4 rounded' onClick={startGame}>Start game</button>}
                    {
                        <div>
                            {currentRoom?.hasGameStarted && isSMFromATeam() &&
                                <div className='my-2 flex'>
                                    <input
                                        type="text"
                                        className='p-2 rounded me-2 flex-1'
                                        placeholder='Give clue'
                                        onChange={e => setClueMessage(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        className='p-2 rounded me-2'
                                        placeholder='Words'
                                        min={1}
                                        max={9}
                                        onChange={e => setClueWords(parseInt(e.target.value))}
                                    />
                                    <button className='bg-blue-700 p-2 px-4 rounded' onClick={giveClue}>Give clue</button>
                                </div>
                            }
                            {currentRoom?.hasGameStarted && <p>{roomStateMessage()}</p>}
                        </div>
                    }
                </div>
            </div >
        </div>

    )
}

export default ActiveRoom