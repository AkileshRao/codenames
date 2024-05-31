import React, { ChangeEvent } from 'react'
import { Member } from '../types';

type TeamCard = {
    team: 'red' | 'blue';
    members: Member[];
    score: number;
    handleChangeRole: (teamRole: string) => void
}

const TeamCard = ({ team, members, score, handleChangeRole }: TeamCard) => {

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleChangeRole(e.target.value)
    }

    return (
        <div className={`rounded-lg flex flex-col items-start p-4 min-w-[250px] mb-2 ${team === 'blue' ? 'bg-indigo-700' : 'bg-orange-700'}`}>
            <div className='flex justify-between w-full'>
                <div className='flex flex-col items-start gap-1'>
                    <p className='text-xs'>Join as</p>
                    <div className='flex gap-1'>
                        <input type="radio" id={`${team}-sm`} name='role' className={'w-[15px]'} onChange={handleChange} value={`${team}-sm`} />
                        <label htmlFor={`${team}-sm`} className='text-sm'>Spymaster</label>
                    </div>
                    <div className='flex gap-1'>
                        <input type="radio" id={`${team}-op`} name='role' className={'w-[15px]'} onChange={handleChange} value={`${team}-op`} />
                        <label htmlFor={`${team}-op`} className='text-sm'>Operative</label>
                    </div>
                </div>
                <div>
                    <p className='text-xs'>Score</p>
                    <p className='text-4xl font-bold mb-6'>{score}</p>
                </div>
            </div>

            <div>
                <p className='text-xs'>Members</p>
                {
                    members && members.map(member => {
                        return (
                            <p>{member.playerName}{member.role === 'sm' ? "(SM)" : ""}</p>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default TeamCard