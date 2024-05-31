export const createRandomEntity = (type: 'room' | 'player') => {
    return `${type}_${Math.floor(Math.random() * 100000000)}`;
}

//Checks if room already exists. If yes, returns the room else returns false.
export const activeRoom = (roomId: string) => {
    const rooms = localStorage.getItem('rooms');
    const parsedRooms = rooms && JSON.parse(rooms);
    if (parsedRooms?.[roomId] && parsedRooms[roomId]['roomId'] && parsedRooms[roomId]['playerId'] && parsedRooms[roomId]['playerName']) {
        return parsedRooms[roomId]
    }
    return false;
}

//Gets the room details from the localStorage
export const getRoomFromLocalStorage = (roomId: string) => {
    const rooms = localStorage.getItem('rooms');
    if (rooms) {
        const parsedRooms = JSON.parse(rooms);
        return parsedRooms[roomId];
    }
    return null;
}

// export const setRoomInLocalStorage = () => {

// }