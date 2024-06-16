import React from 'react';
import { CardType } from '../types'

const getColor = (color: 'red' | 'blue' | 'black' | 'neutral', isFlipped: boolean, isSM: boolean) => {
    if (!isFlipped && !isSM) return 'bg-orange-200  border-stone-100'
    if (color === 'red') return 'bg-orange-700  border-orange-400';
    if (color === 'blue') return 'bg-indigo-700  border-indigo-400';
    if (color === 'black') return 'bg-black';
    if (color === 'neutral') return 'bg-slate-700  border-slate-400';
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
        <div className={`${getColor(color, isFlipped, isSM)} relative rounded min-w-max shadow overflow-hidden`} onClick={handleCardFlip}>
            <p className='w-full text-white text-black font-black p-[1vw] text-[1vw] rounded'>{cardName}</p>
        </div>
    )
}

export default Card