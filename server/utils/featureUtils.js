const { CardPacks } = require("../dataset/CardPacks");

const rooms = {};
let cardPack = {};
const logs = {};

const findPlayerInRoom = (playerId, roomId) => {
    const roomToCheck = rooms[roomId];
    return roomToCheck?.players?.find(player => player.playerId === playerId);
}

const getRoom = (roomId) => {
    return rooms?.[roomId];
}


const loadCardPack = () => {
    const randomCardPack = Math.floor(Math.random() * 5);
    if (!cardPack?.name) {
        console.log("IMIN")
        cardPack = JSON.parse(JSON.stringify(CardPacks.find(pack => pack.name == randomCardPack)));
    }
    console.log("CARDPACK", cardPack)
    return cardPack;
}

const cardFlip = (card, roomId, playerName, currentTurn) => {
    const room = getRoom(roomId);
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
        room.winner = { team: currentTurn.team, reason: `Team ${team} guessed all the cards!` };
    } else {
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
    console.log(room);
    return { cardPack, room };
}

const joinRoom = ({ roomId, playerId, playerName }) => {
    const doesPlayerExist = findPlayerInRoom(playerId, roomId);
    if (!doesPlayerExist) {
        const player = { playerId, playerName };
        const doesRoomHavePlayers = rooms?.[roomId] && rooms[roomId].players;
        rooms[roomId] = {
            players: doesRoomHavePlayers ? [...rooms[roomId].players, player] : [player],
            red: {
                sm: rooms[roomId]?.red.sm ?? null,
                ops: rooms[roomId] ? [...rooms[roomId].red.ops] : [],
                score: 9
            },
            blue: {
                sm: rooms[roomId]?.blue.sm ?? null,
                ops: rooms[roomId] ? [...rooms[roomId].blue.ops] : [],
                score: 9
            },
            hasGameStarted: false,
            currentTurn: null,
            winner: null
        }
    }
    return rooms[roomId];
}

const resetRoom = (roomId) => {
    rooms[roomId] = {
        players: [...rooms[roomId].players],
        red: {
            sm: null,
            ops: [],
            score: 9
        },
        blue: {
            sm: null,
            ops: [],
            score: 9
        },
        hasGameStarted: false,
        currentTurn: null,
        winner: null
    }
    cardPack = null;
    const newCardPack = loadCardPack();
    logs[roomId] = [];
    return { room: rooms[roomId], cardPack: newCardPack, logs: logs[roomId] };
}

const joinTeam = (team, role, roomId, playerId, playerName) => {
    const room = getRoom(roomId);
    const member = { playerId, playerName, role };
    if (role === 'sm') {
        room[team][role] = member;
    } else {
        room[team]['ops'].push(member);
    }
    addToLogs(roomId, `${playerName} joined team ${team}${role === 'sm' ? '(SM)' : ''}`);
    return room;
}

const startGame = (roomId) => {
    const room = getRoom(roomId);
    room.hasGameStarted = true;
    room.currentTurn = {
        team: 'red',
        state: 'giveClue',
        wordsAllowedToGuess: 0,
        clue: ''
    }
    return room;
}

const giveClue = (roomId, sm, updatedTurn) => {
    addToLogs(`${sm} gave clue:${updatedTurn.clue} for ${updatedTurn.wordsAllowedToGuess} words`);
    const room = getRoom(roomId);
    room.currentTurn = { ...updatedTurn };
    return room;
}

const addToLogs = (roomId, logMessage) => {
    logs[roomId] = logs[roomId] ? [...logs[roomId], logMessage] : [logMessage];
}

module.exports = {
    findPlayerInRoom, joinRoom, rooms, getRoom, loadCardPack, joinTeam, addToLogs, logs, startGame, cardFlip, giveClue, resetRoom
}
