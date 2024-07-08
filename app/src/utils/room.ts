import { TeamType } from "../types";
import { getLocalStorageRoom } from "./localStorage";

export const createRandomEntity = (type: 'room' | 'player') => {
    return `${type}_${Math.floor(Math.random() * 100000000)}`;
}

//Checks if room already exists inside localStorage. If yes, returns the room else returns false.
export const activeRoom = (roomId: string) => {
    const rooms = localStorage.getItem('rooms');
    const parsedRooms = rooms && JSON.parse(rooms);
    if (parsedRooms?.[roomId] && parsedRooms[roomId]['roomId'] && parsedRooms[roomId]['playerId'] && parsedRooms[roomId]['playerName']) {
        return parsedRooms[roomId]
    }
    return false;
}

//Checks is current user is already in a team
export const haveIJoinedTeam = (red: TeamType | undefined, blue: TeamType | undefined, roomId?: string) => {
    const room = getLocalStorageRoom(roomId);
    const playerIsInRedOps = red?.ops.find(player => player.playerId === room?.playerId);
    const playerIsInBlueOps = blue?.ops.find(player => player.playerId === room?.playerId);
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


