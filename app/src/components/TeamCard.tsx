import React, { ChangeEvent, useCallback } from 'react'
import { Member, TeamCardType } from '../types';
import { RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

const TeamCard = ({ team, members, score, playerJoined }: TeamCardType) => {
    const isAnSMAvailable = () => {
        return members?.find(member => member.role === 'sm');
    }

    return (
        <div className={`rounded-lg flex flex-col items-start p-4 min-w-[20vw] mb-2 ${team === 'blue' ? 'bg-indigo-700' : 'bg-orange-700'}`}>
            <div className='flex justify-between w-full'>
                {!playerJoined &&
                    <div className='flex flex-col items-start'>
                        <p className='text-xs text-foreground mb-1'>Join as</p>
                        {!isAnSMAvailable() &&
                            <div className='flex gap-1'>
                                <RadioGroupItem id={`${team}-sm`} className={'w-[15px]'} value={`${team}-sm`} />
                                <Label htmlFor={`${team}-sm`} className='text-sm font-light text-foreground'>Spymaster</Label>
                            </div>
                        }
                        <div className='flex gap-1'>
                            <RadioGroupItem id={`${team}-op`} className={'w-[15px]'} value={`${team}-op`} />
                            <Label htmlFor={`${team}-op`} className='text-sm font-light text-foreground'>Operative</Label>
                        </div>
                    </div>
                }
                <div>
                    <p className='text-xs text-foreground'>Score</p>
                    <p className='text-4xl font-bold mb-6 text-foreground'>{score}</p>
                </div>
            </div>

            {members && members.length > 0 &&
                <div className='flex flex-col items-start'>
                    <p className='text-xs text-foreground'>Members</p>
                    <div>
                        {
                            members.map((member, index) => {
                                return (
                                    <span className='text-xs' key={member.playerId}>{member.playerName}{member.role === 'sm' ? "(SM)" : ""}{index !== members.length - 1 && ","}</span>
                                )
                            })
                        }
                    </div>
                </div>
            }

        </div>
    )
}

export default TeamCard