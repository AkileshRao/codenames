import React from 'react'
import { CurrentRoom, Member } from '../types'
import { ReactNode } from 'react';

type ScoreBoardTeamProps = {
    teamMembers: Member[];
    teamScore?: number;
    team: 'red' | 'blue';
}

//Individual block for score a team members
const ScoreBoardTeam = ({ teamMembers, teamScore, team }: ScoreBoardTeamProps) => {
    return (
        <div className='w-[15vw]'>
            <div className={`flex flex-col p-2 rounded mb-2 ${team === 'red' ? 'bg-orange-700' : 'bg-indigo-700'}`}>
                <p className='opacity-50 text-[1vw] font-medium'>Score</p>
                <p className='text-[1.8vw] font-bold'>{teamScore}</p>
            </div>
            <div className={`flex flex-col p-2 rounded ${team === 'red' ? 'bg-orange-700' : 'bg-indigo-700'}`}>
                <p className='opacity-50 text-[1vw] font-medium'>Members</p>
                <div>
                    {
                        teamMembers.map(member => <p className='text-[1vw]'>
                            {member.playerName}{member.role === 'sm' ? "(SM)" : ''}
                        </p>)
                    }
                </div>
            </div>
        </div>
    )
}

type ScoreBoardProps = {
    currentRoom: CurrentRoom;
    children: ReactNode;
}

//Layout component that has scoreboards on the side and children in the middle
//Children will have the main cards component and the logs section
const ScoreBoard = ({ currentRoom, children }: ScoreBoardProps) => {
    const teamMembers = (team: 'red' | 'blue') => {
        let teamMembers: Member[] = [];
        if (currentRoom?.[team].sm) teamMembers.push(currentRoom?.[team].sm!);
        if (currentRoom?.[team].ops) teamMembers = [...teamMembers, ...currentRoom?.[team].ops];
        return teamMembers;
    }

    return (
        <div className='flex gap-4 justify-between'>
            <ScoreBoardTeam teamMembers={teamMembers('red')} teamScore={currentRoom?.red.score} team='red' />
            <div className='flex flex-col gap-4'>
                {children}
            </div>
            <ScoreBoardTeam teamMembers={teamMembers('blue')} teamScore={currentRoom?.blue.score} team='blue' />
        </div>
    )
}

export default ScoreBoard