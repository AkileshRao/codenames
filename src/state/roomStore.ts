import { create } from "zustand";
import { Player } from "../types";

type RoomState = {
    currentRoom: {
        players: Player[];
        totalPlayers: number;
        red: Player[];
        blue: Player[];
        hasSM: boolean;
    } | null;
    addPlayer: (player: Player) => void;
    incrementTotalPlayers: () => void;
    joinTeam: () => void;
    updateRoomSM: () => void;
}

const useRoomStore = create((set) => ({
    currentRoom: null,
    addPlayer: (newPlayers: Player[]) => set((state: RoomState) => ({
        currentRoom: {
            ...state.currentRoom,
            players: newPlayers,
        }
    })),
    incrementTotalPlayers: () => set((state: RoomState) => ({
        currentRoom: {
            ...state.currentRoom,
            totalPlayers: state.currentRoom?.totalPlayers ? state.currentRoom?.totalPlayers + 1 : 1
        }
    })),
    updateRoomSM: () => set((state: RoomState) => ({
        currentRoom: {
            ...state.currentRoom,
            hasSM: true
        }
    })),
    // joinTeam: (team) => set((state: RoomState) => {
    //     // Get the team and then push the player to that team
    //     // return currentRoom: {
    //     //     ...state.currentRoom,

    //     // }
    // })
}));

export default useRoomStore;