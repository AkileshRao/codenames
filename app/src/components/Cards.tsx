import useRoomStore, { RoomState } from '../state/roomStore';
import Card from './Card';
import { useSocket } from '../state/SocketContext';
import { CardType, CurrentRoom } from '../types';
import React from 'react';
import { getLocalStorageRoom } from '../utils/localStorage';

const Cards = ({ currentRoom, isPlayerASM, roomId }: { currentRoom: CurrentRoom, isPlayerASM: boolean, roomId: string }) => {
    const currentPack = useRoomStore((state: RoomState) => state.currentPack);
    const { socket } = useSocket();

    const onCardFlipped = (card: CardType) => {
        const { playerName, playerId } = getLocalStorageRoom(roomId)!;
        const isPlayerFromTheSameTeam = currentRoom?.[currentRoom?.currentTurn?.team!].ops.find(player => player.playerId === playerId);
        if (isPlayerFromTheSameTeam) {
            socket?.emit('card_flip', card, roomId, playerName, currentRoom?.currentTurn);
        }
    }

    return (
        <div className='grid grid-cols-6 gap-[1vw]'>
            {
                currentPack?.cards.map(card => {
                    return (
                        <Card
                            card={card}
                            key={card.cardName}
                            onCardFlipped={onCardFlipped}
                            canFlipCard={currentRoom?.hasGameStarted! && !isPlayerASM && currentRoom.currentTurn?.state === 'guess'}
                            isPlayerASM={isPlayerASM}
                        />
                    )
                })
            }
        </div>
    )
}

export default Cards