import useRoomStore, { RoomState } from '../state/roomStore';
import Card from './Card';
import { useSocket } from '../state/SocketContext';
import { CardType, CurrentRoom } from '../types';
import { getRoomFromLocalStorage } from '../utils';

const Cards = ({ currentRoom, isSM, roomId }: { currentRoom: CurrentRoom, isSM: boolean, roomId: string }) => {
    const currentPack = useRoomStore((state: RoomState) => state.currentPack);
    const { socket } = useSocket();

    const onCardFlipped = (card: CardType) => {
        const { playerName, playerId } = getRoomFromLocalStorage(roomId)!;
        const isPlayerFromTheSameTeam = currentRoom?.[currentRoom?.currentTurn?.team!].ops.find(player => player.playerId === playerId);
        console.log(isPlayerFromTheSameTeam)
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
                            canFlipCard={currentRoom?.hasGameStarted! && !isSM && currentRoom.currentTurn?.state === 'guess'}
                            isSM={isSM}
                        />
                    )
                })
            }
        </div>
    )
}

export default Cards