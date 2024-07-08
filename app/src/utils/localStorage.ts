import { LocalStorageRoom } from "../types";

//Gets the room details from the localStorage
export const getLocalStorageRoom = (roomId?: string): null | LocalStorageRoom => {
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

//Inserts/Updates a room inside the localstorage rooms object
export const upsertLocalStorageRoom = (room: LocalStorageRoom) => {
    const rooms = getLocalStorageRooms();
    rooms[room.roomId] = { ...room };
    localStorage.setItem('rooms', JSON.stringify(rooms));
}