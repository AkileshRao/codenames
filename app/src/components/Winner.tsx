import React from 'react'
import { Button, Card, CardContent, CardHeader } from './ui'
import { useSocket } from '../state/SocketContext'

type WinnerProps = {
    roomId: string;
    team: 'red' | 'blue';
    winningReason: string;
}

const Winner = ({ roomId, team, winningReason }: WinnerProps) => {
    const { socket } = useSocket();
    return (
        <div className='flex items-center justify-center h-screen w-screen bg-zinc-950 font-geist'>
            <Card>
                <CardHeader>
                    <h2 className='font-bold text-3xl'>Team <span className={`${team === 'red' ? 'text-orange-700' : 'text-indigo-700'}`}>{team}</span> won</h2>
                </CardHeader>
                <CardContent>
                    <p className='text-xl opacity-50 mb-4'>{winningReason}</p>
                    <Button onClick={() => socket?.emit('reset_game', roomId)}>Reset game</Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default Winner