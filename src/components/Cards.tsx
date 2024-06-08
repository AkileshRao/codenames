import React from 'react'
import useRoomStore, { RoomState } from '../state/roomStore';
import Card from './Card';

const Cards = () => {
    const currentPack = useRoomStore((state: RoomState) => state.currentPack);
    return (
        <div className='grid grid-cols-6 gap-[1vw]'>
            {
                currentPack?.cards.map(card => {
                    return (
                        <Card cardName={card.cardName} color={card.color} isFlipped={card.isFlipped} key={card.cardName} />
                    )
                })
            }
        </div>
    )
}

export default Cards