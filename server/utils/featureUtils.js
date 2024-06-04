const rooms = {};

const findPlayerInRoom = (playerId, roomId) => {
    const roomToCheck = rooms[roomId];
    return roomToCheck?.players?.find(player => player.playerId === playerId);
}

const joinRoom = ({ roomId, playerId, playerName }) => {
    const doesPlayerExist = findPlayerInRoom(playerId, roomId);
    if (!doesPlayerExist) {
        const player = { playerId, playerName };
        const doesRoomHavePlayers = rooms?.[roomId] && rooms[roomId].players;
        rooms[roomId] = {
            players: doesRoomHavePlayers ? [...rooms[roomId].players, player] : [player],
            total: doesRoomHavePlayers ? rooms[roomId].players : 1,
            red: { sm: null, ops: [] },
            blue: { sm: null, ops: [] }
        }
        return rooms[roomId];
    } else {
        return rooms[roomId];
    }
}

const getRoom = (roomId) => {
    console.log(rooms);
    return rooms?.[roomId];
}

module.exports = {
    findPlayerInRoom, joinRoom, rooms, getRoom
}