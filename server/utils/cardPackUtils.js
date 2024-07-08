const { CardPacks } = require("../dataset/CardPacks");
const { addToLogs } = require("./logsUtils")
const initialCardPack = { name: '', cards: [] };

let cardPack = {
    ...initialCardPack
};


const loadCardPack = () => {
    const randomCardPack = Math.ceil(Math.random() * 5);
    console.log(randomCardPack)
    if (!cardPack?.name) {
        cardPack = JSON.parse(JSON.stringify(CardPacks.find(pack => pack.name == randomCardPack)));
    }
    return cardPack;
}

const resetCardPack = () => {
    // Clear the existing properties and reset to initial state
    Object.keys(cardPack).forEach(key => delete cardPack[key]);
    Object.assign(cardPack, initialCardPack);
    return loadCardPack();
}

const cardFlip = (card, room, roomId, playerName, currentTurn) => {
    if (card.color === 'red' || card.color === 'blue') room[card.color].score -= 1;
    cardPack.cards.map(c => {
        c.isFlipped = (c.cardName === card.cardName || c.isFlipped) ? true : false;
    })
    if (card.color === 'black') {
        room['currentTurn'] = null;
        room.hasGameStarted = false;
        room.winner = {
            team: currentTurn.team === 'red' ? 'blue' : 'red',
            reason: `Team ${currentTurn.team} guessed the black card!`,
        };
        return { cardPack, room }
    }
    if (room[currentTurn.team].score === 0) {
        room['currentTurn'] = null;
        room.hasGameStarted = false;
        room.winner = { team: currentTurn.team, reason: `Team ${currentTurn.team} guessed all the cards!` };
    } else {
        addToLogs(roomId, `Team ${currentTurn.team}'s ${playerName} guessed ${card.cardName}`)
        if (currentTurn.wordsAllowedToGuess === 1) {
            room['currentTurn'] = {
                wordsAllowedToGuess: 0,
                team: currentTurn.team === 'blue' ? 'red' : 'blue',
                state: 'giveClue',
                clue: ''
            }
        } else {
            room['currentTurn'] = {
                ...room.currentTurn,
                wordsAllowedToGuess: room.currentTurn.wordsAllowedToGuess - 1,
            }
        }
    }
    return { cardPack, room };
}

module.exports = { cardPack, loadCardPack, cardFlip, resetCardPack }