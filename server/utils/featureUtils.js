const { CardPacks } = require("../dataset/CardPacks");

const rooms = {};
let cardPack = {};
const logs = {};

const findPlayerInRoom = (playerId, roomId) => {
    const roomToCheck = rooms[roomId];
    return roomToCheck?.players?.find(player => player.playerId === playerId);
}

const loadCardPack = () => {
    const randomCardPack = Math.floor(Math.random() * 5);
    if (!cardPack?.name) {
        cardPack = CardPacks.find(pack => pack.name == randomCardPack);
    }
    return cardPack;
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

const getRoom = (roomId) => {
    return rooms?.[roomId];
}

const joinTeam = (team, role, roomId, playerId, playerName) => {
    const room = getRoom(roomId);
    const member = { playerId, playerName, role };
    if (role === 'sm') {
        room[team][role] = member;
    } else {
        room[team]['ops'].push(member);
    }
    addToLogs(roomId, `${playerName} joined team ${team}`);
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

const addToLogs = (roomId, logMessage) => {
    logs[roomId] = logs[roomId] ? [...logs[roomId], logMessage] : [logMessage];
}

module.exports = {
    findPlayerInRoom, joinRoom, rooms, getRoom, loadCardPack, joinTeam, addToLogs, logs, startGame
}