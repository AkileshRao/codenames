import React from 'react'
import { CardType } from '../types'


const getColor = (color: 'red' | 'blue' | 'black' | 'neutral', isFlipped: boolean) => {
    if (!isFlipped) return 'bg-orange-200  border-stone-100'
    if (color === 'red') return 'bg-orange-700  border-orange-400';
    if (color === 'blue') return 'bg-indigo-700  border-indigo-400';
    if (color === 'black') return 'bg-black';
    if (color === 'neutral') return 'bg-slate-700  border-slate-400';
}

const Card = ({ cardName, color, isFlipped }: CardType) => {
    return (
        <div className={`relative bg-blue-200 rounded min-w-max shadow overflow-hidden aspect-ratio-square w-[10vw]`}>
            <p className='bg-white w-full text-black font-black p-[1vw] text-[1vw] rounded'>{cardName}</p>
        </div>
    )
}

export default Card