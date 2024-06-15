import React, { ChangeEvent, useCallback } from 'react'
import { Member, TeamCardType } from '../types';

const TeamCard = ({ team, members, score, handleChangeRole, playerJoined }: TeamCardType) => {
    console.log(playerJoined)
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleChangeRole(e.target.value)
    }
    const isAnSMAvailable = () => {
        return members?.find(member => member.role === 'sm');
    }

    return (
        <div className={`rounded-lg flex flex-col items-start p-4 min-w-[20vw] mb-2 ${team === 'blue' ? 'bg-indigo-700' : 'bg-orange-700'}`}>
            <div className='flex justify-between w-full'>
                {!playerJoined &&
                    <div className='flex flex-col items-start gap-1'>
                        <p className='text-xs'>Join as</p>
                        {!isAnSMAvailable() &&
                            <div className='flex gap-1'>
                                <input type="radio" id={`${team}-sm`} name='role' className={'w-[15px]'} onChange={handleChange} value={`${team}-sm`} />
                                <label htmlFor={`${team}-sm`} className='text-sm'>Spymaster</label>
                            </div>
                        }
                        <div className='flex gap-1'>
                            <input type="radio" id={`${team}-op`} name='role' className={'w-[15px]'} onChange={handleChange} value={`${team}-op`} />
                            <label htmlFor={`${team}-op`} className='text-sm'>Operative</label>
                        </div>
                    </div>
                }
                <div>
                    <p className='text-xs'>Score</p>
                    <p className='text-4xl font-bold mb-6'>{score}</p>
                </div>
            </div>

            <div className='flex flex-col items-start'>
                <p className='text-xs'>Members</p>
                <div>
                    {
                        members && members.map((member, index) => {
                            return (
                                <span className='text-xs' key={member.playerId}>{member.playerName}{member.role === 'sm' ? "(SM)" : ""}{index !== members.length - 1 && ","}</span>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default TeamCard