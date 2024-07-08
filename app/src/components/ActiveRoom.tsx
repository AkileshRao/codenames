import React, { useCallback, useMemo } from 'react';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../state/SocketContext'
import { Member } from '../types';
import { activeRoom, haveIJoinedTeam } from '../utils/room';
import { getLocalStorageRoom } from '../utils/localStorage';
import useRoomStore, { RoomState } from '../state/roomStore';
import { Button, Input, Toaster, useToast } from './ui';
import Logs from './Logs';
import Cards from './Cards';
import TeamSelector from './TeamSelector';
import JoinRoom from './JoinRoom';
import ScoreBoard from './ScoreBorad';
import Winner from './Winner';

const ActiveRoom = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { socket, setSocket, connect } = useSocket();
    const currentRoom = useRoomStore((state: RoomState) => state.currentRoom);
    const [clueMessage, setClueMessage] = useState('');
    const [clueWords, setClueWords] = useState(0);
    const [isNewMember, setIsNewMember] = useState(false);

    const playerJoined = useMemo(() => {
        return haveIJoinedTeam(currentRoom?.red, currentRoom?.blue, roomId);
    }, [currentRoom])

    const localStorageRoom = useMemo(() => {
        return getLocalStorageRoom(roomId)
    }, [isNewMember])

    //If localstorage already has userDetails
    //use those details to reconnect as the same user, into the same room.
    //Used primarily to check on reload
    //Also handles socket disconnection 
    useEffect(() => {
        if (roomId) {
            const activeLocalStorageRoom = activeRoom(roomId)
            if (activeLocalStorageRoom) {
                if (!socket) connect(activeLocalStorageRoom);
                setIsNewMember(false);
            } else {
                setIsNewMember(true)
            }
        }

        return () => {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        };
    }, [])

    //Joins a team
    const handleTeamSelect = (teamRole: string) => {
        const [team, role] = teamRole.split('-');
        const room = getLocalStorageRoom(roomId);
        const messageObj = {
            playerId: room?.playerId,
            playerName: room?.playerName,
            roomId, team, role
        }
        socket?.emit('join_team', messageObj);
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

    const isPlayerASM = useCallback(() => {
        const room = getLocalStorageRoom(roomId);
        const spymasters = [currentRoom?.blue.sm?.playerId, currentRoom?.red.sm?.playerId];
        return spymasters.indexOf(room?.playerId) >= 0;
    }, [currentRoom])

    //Do not let both SMs give clue in "give clue" phase
    const isSMFromATeam = () => {
        const { team, state } = currentRoom?.currentTurn!;
        const currentTurnSM = currentRoom?.[team as 'red' | 'blue'].sm?.playerId;
        const playerId = localStorageRoom?.playerId!;
        if (isPlayerASM() && state === 'giveClue' && currentTurnSM === playerId) {
            return true;
        }
        return false;
    }

    //If game over
    if (currentRoom?.winner) {
        const { reason, team } = currentRoom.winner;
        return <Winner team={team} roomId={roomId!} winningReason={reason} />
    }

    //If user directly goes to a room URL that they're not part of
    if (isNewMember) {
        return (<div className='flex items-center justify-center h-screen w-screen bg-zinc-950 font-geist'>
            <JoinRoom hasUserJoinedExistingRoom={(userJoined) => { if (userJoined === true) setIsNewMember(false) }} />
        </div>)
    }

    return (
        <div className={`font-geist h-screen w-screen p-4 bg-zinc-950 ${currentRoom?.currentTurn?.team === 'red' ? 'border-8 border-orange-700' : (currentRoom?.currentTurn?.team === 'blue' ? 'border-8 border-indigo-700' : 'border-0')}`}>
            <div className='w-full flex justify-between mb-8'>
                <div>
                    <p className='text-[1vw]'><span className='opacity-50'>Playing as: </span><span className='opacity-100 font-bold'>{localStorageRoom?.playerName}</span></p>
                    <p className='text-[1vw]'><span className='opacity-50'>Room: </span><span className='opacity-100 font-bold'>{roomId?.split('_')[1]}</span></p>
                </div>
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
                    <ScoreBoard currentRoom={currentRoom}>
                        {playerJoined && <Cards currentRoom={currentRoom} roomId={roomId!} isPlayerASM={isPlayerASM()} />}
                        <div className='flex flex-col'>
                            <Logs />
                        </div>
                    </ScoreBoard>
                </div >
            }
            <Toaster />
        </div >
    )
}

export default ActiveRoom