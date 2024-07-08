let { cardPack, loadCardPack, resetCardPack } = require("./cardPackUtils");
const { addToLogs, logs } = require("./logsUtils")

const rooms = {};

const findPlayerInRoom = (playerId, roomId) => {
    const roomToCheck = rooms[roomId];
    return roomToCheck?.players?.find(player => player.playerId === playerId);
}

const getRoom = (roomId) => rooms?.[roomId];

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
    const newCardPack = resetCardPack();
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
    addToLogs(roomId, `${sm} gave clue:${updatedTurn.clue} for ${updatedTurn.wordsAllowedToGuess} words`);
    const room = getRoom(roomId);
    room.currentTurn = { ...updatedTurn };
    return room;
}

module.exports = {
    rooms, getRoom, joinRoom, giveClue, startGame, joinTeam, resetRoom
}