import React from 'react';
import { CardType } from '../types'

const getColor = (color: 'red' | 'blue' | 'black' | 'neutral', isFlipped: boolean, isSM: boolean) => {
    if (!isFlipped && !isSM) return 'bg-transparent border-2 border-white'
    if (color === 'red') return 'bg-orange-800  border-orange-400';
    if (color === 'blue') return 'bg-indigo-800  border-indigo-400';
    if (color === 'black') return 'bg-black border-2 border-white';
    if (color === 'neutral') return 'bg-slate-800  border-slate-400';
}

type CardComponentType = {
    card: CardType;
    onCardFlipped: (card: CardType) => void;
    canFlipCard: boolean;
    isSM: boolean;
};
const Card = ({ card, onCardFlipped, canFlipCard, isSM }: CardComponentType) => {
    const { cardName, color, isFlipped } = card;
    const handleCardFlip = () => {
        if (canFlipCard) onCardFlipped(card);
    }

    return (
        <div className={`${getColor(color, isFlipped, isSM)} cursor-pointer p-[1vw] w-[8vw] min-w-full rounded flex items-center justify-center`} onClick={handleCardFlip}>
            <p className='text-[0.9vw] text-center text-white font-bold line-clamp-1'>{cardName}</p>
        </div>
    )
}

export default Card