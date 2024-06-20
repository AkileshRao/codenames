import React from 'react'
import { CurrentRoom, Member } from '../types'
import { ReactNode } from 'react';

type ScoreBoardProps = {
    currentRoom: CurrentRoom;
    children: ReactNode;
}

const ScoreBoard = ({ currentRoom, children }: ScoreBoardProps) => {

    const teamMembers = (team: 'red' | 'blue') => {
        let teamMembers: Member[] = [];
        if (currentRoom?.[team].sm) teamMembers.push(currentRoom?.[team].sm!);
        if (currentRoom?.[team].ops) teamMembers = [...teamMembers, ...currentRoom?.[team].ops];
        return teamMembers;
    }

    return (
        <div className='flex gap-4 justify-between'>
            <div className='w-[15vw]'>
                <div className='flex flex-col bg-orange-800 p-2 rounded mb-2'>
                    <p className='opacity-50 text-[1vw] font-medium'>Score</p>
                    <p className='text-[1.8vw] font-bold'>{currentRoom?.red.score}</p>
                </div>
                <div className='flex flex-col bg-orange-800 p-2 rounded'>
                    <p className='opacity-50 text-[1vw] font-medium'>Members</p>
                    <div>
                        {
                            teamMembers('red').map(member => <p className='text-[1vw]'>
                                {member.playerName}{member.role === 'sm' ? "(SM)" : ''}
                            </p>)
                        }
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                {children}
            </div>
            <div className='w-[15vw]'>
                <div className='flex flex-col bg-indigo-800 p-2 rounded mb-2'>
                    <p className='opacity-50 text-[1vw] font-medium'>Score</p>
                    <p className='text-[1.8vw] font-bold'>{currentRoom?.blue.score}</p>
                </div>
                <div className='flex flex-col bg-indigo-800 p-2 rounded'>
                    <p className='opacity-50 text-[1vw] font-medium'>Members</p>
                    <div>
                        {
                            teamMembers('blue').map(member => <p className='text-[1vw]'>
                                {member.playerName}{member.role === 'sm' ? "(SM)" : ''}
                            </p>)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScoreBoard