import { useCallback, useEffect, useState } from 'react'
import TeamCard from './TeamCard'
import { useSocket } from '../state/SocketContext'
import Logs from './Logs';
import { activeRoom, getLocalStorageRooms, getRoomFromLocalStorage, haveIJoinedTeam } from '../utils';
import useRoomStore, { RoomState } from '../state/roomStore';
import Cards from './Cards';
import { LocalStorageRoom, Member } from '../types';
import React from 'react';
import { Button } from './ui/button'
import TeamSelector from './TeamSelector';
import { useNavigate, useParams } from 'react-router-dom';
import JoinRoom from './JoinRoom';
import ScoreBoard from './ScoreBorad';
import { Input } from './ui/input';
import { Toaster } from './ui/toaster';
import { useToast } from './ui/use-toast';
import { Card, CardContent, CardHeader } from './ui/card';

const ActiveRoom = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { socket, setSocket, connect } = useSocket();
    const currentRoom = useRoomStore((state: RoomState) => state.currentRoom);
    const [playerJoined, setPlayerJoined] = useState(false);
    const [clueMessage, setClueMessage] = useState('');
    const [clueWords, setClueWords] = useState(0);
    const [localStorageRoom, setLocalStorageRoom] = useState<LocalStorageRoom | null>(null);
    const [isNewMember, setIsNewMember] = useState(false);

    useEffect(() => {
        if (roomId) {
            (async () => {
                const localStorageRoom = activeRoom(roomId)
                if (localStorageRoom) {
                    if (!socket) connect(localStorageRoom);
                    setIsNewMember(false);
                } else {
                    setIsNewMember(true)
                }
            })()
        }
    }, [])

    useEffect(() => {
        setLocalStorageRoom(getRoomFromLocalStorage(roomId));
    }, [isNewMember])

    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        };
    }, [socket]);

    useEffect(() => {
        console.log(currentRoom)
        const joined = haveIJoinedTeam(currentRoom?.red, currentRoom?.blue, roomId);
        setPlayerJoined(joined);
    }, [roomId, currentRoom])

    const handleTeamSelect = (teamRole) => {
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
        const { red, blue } = currentRoom!;
        if (!red.sm || !blue.sm) {
            toast({
                title: "Can't start the game.",
                description: "Both teams need a spymaster."
            })
        } else if (red.ops.length === 0 || blue.ops.length === 0) {
            toast({
                title: "Can't start the game.",
                description: "Both teams should at least have 1 operative."
            })
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
            toast({
                title: "Error",
                description: "Invalid clue message or invalid word count!"
            })
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
        return <div className='flex items-center justify-center h-screen w-screen bg-zinc-950 font-geist'>
            <Card>
                <CardHeader>
                    <h2 className='font-bold text-3xl'>Team <span className={`${currentRoom.winner.team === 'red' ? 'text-orange-700' : 'text-indigo-700'}`}>{currentRoom.winner.team}</span> won</h2>
                </CardHeader>
                <CardContent>
                    <p className='text-xl opacity-50 mb-4'>{currentRoom.winner.reason}</p>
                    <Button onClick={resetGame}>Reset game</Button>
                </CardContent>
            </Card>
        </div>
    }

    if (isNewMember) {
        return (<div className='flex items-center justify-center h-screen w-screen bg-zinc-950 font-geist'>
            <JoinRoom hasUserJoinedExistingRoom={(val) => { if (val === true) setIsNewMember(false) }} />
        </div>)
    }

    return (
        <div className={`font-geist h-screen w-screen p-4 bg-zinc-950 ${currentRoom?.currentTurn?.team === 'red' ? 'border-8 border-orange-700' : (currentRoom?.currentTurn?.team === 'blue' ? 'border-8 border-indigo-700' : 'border-0')}`}>
            <div className='w-full flex justify-between mb-8'>
                <div>
                    <p className='text-[1vw]'><span className='opacity-50'>Playing as: </span><span className='opacity-100 font-bold'>{localStorageRoom?.playerName}</span></p>
                    <p className='text-[1vw]'><span className='opacity-50'>Room: </span><span className='opacity-100 font-bold'>{roomId?.split('_')[1]}</span></p>
                </div>
                <div>
                    {
                        <div>
                            {currentRoom?.hasGameStarted && isSMFromATeam() &&
                                <div className='my-2 flex'>
                                    <Input
                                        className='p-2 rounded me-2'
                                        placeholder='Give clue'
                                        onChange={e => setClueMessage(e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        className='p-2 rounded me-2'
                                        placeholder='Words'
                                        min={1}
                                        max={9}
                                        onChange={e => setClueWords(parseInt(e.target.value))}
                                    />
                                    <Button onClick={giveClue}>Give clue</Button>
                                </div>
                            }
                            {currentRoom?.hasGameStarted && <p className='text-center text-[1.1vw] opacity-50'>{roomStateMessage()}</p>}
                        </div>
                    }
                </div>
                <div className='flex gap-2'>
                    {(!currentRoom?.hasGameStarted) && <Button onClick={startGame} className='font-bold'>Start game</Button>}
                    <Button variant={'destructive'} onClick={() => navigate('/')}>Exit room</Button>
                </div>
            </div>
            {
                !playerJoined &&
                <div className='flex items-center justify-center'>
                    <TeamSelector handleTeamSelect={handleTeamSelect} />
                </div>
            }
            {
                playerJoined &&
                <div className='flex items-center justify-center'>
                    <div>
                        <ScoreBoard currentRoom={currentRoom}>
                            {playerJoined && <Cards currentRoom={currentRoom} roomId={roomId!} isSM={isSM()} />}
                            <div className='flex flex-col'>
                                <Logs />
                            </div>
                        </ScoreBoard>
                    </div>
                </div >
            }
            <Toaster />
        </div >
    )
}

export default ActiveRoom