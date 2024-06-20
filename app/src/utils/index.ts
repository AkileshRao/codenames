import { LocalStorageRoom, TeamType } from "../types";

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
export const getRoomFromLocalStorage = (roomId?: string): null | LocalStorageRoom => {
    const rooms = localStorage.getItem('rooms');
    if (rooms && roomId) {
        const parsedRooms = JSON.parse(rooms);
        return parsedRooms[roomId];
    }
    return null;
}

export const getLocalStorageRooms = () => {
    const rooms = localStorage.getItem('rooms');
    if (rooms) return JSON.parse(rooms);
    return {};
}

export const addRoomToLocalStorage = (room: LocalStorageRoom) => {
    const { roomId } = room;
    const rooms = getLocalStorageRooms();
    rooms[roomId] = room;
    localStorage.setItem('rooms', JSON.stringify(rooms));
}

// export const setRoomInLocalStorage = () => {

// }

export const haveIJoinedTeam = (red: TeamType | undefined, blue: TeamType | undefined, roomId?: string) => {
    const room = getRoomFromLocalStorage(roomId);
    const playerIsInRedOps = red?.ops.find(player => player.playerId === room?.playerId);
    const playerIsInBlueOps = blue?.ops.find(player => player.playerId === room?.playerId);
    console.log(red, blue);
    if (
        red?.sm?.playerId === room?.playerId ||
        blue?.sm?.playerId === room?.playerId ||
        playerIsInRedOps ||
        playerIsInBlueOps
    ) {
        return true;
    } else {
        return false;
    }
}
