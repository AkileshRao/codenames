import { create } from "zustand";
import { Player } from "../types";

type CurrentRoom = {
    players: Player[];
    totalPlayers: number;
    red: {
        sm: Player | null;
        ops: Player[];
    };
    blue: {
        sm: Player | null;
        ops: Player[];
    };
    hasSM: boolean;
} | null;


export type RoomState = {
    currentRoom: CurrentRoom | null;
    initializeRoom: (room: CurrentRoom) => void;
    addPlayer: (newPlayers: Player[]) => void;
    incrementTotalPlayers: () => void;
    // joinTeam: () => void;
    updateRoomSM: () => void;
}

const useRoomStore = create<RoomState>((set) => ({
    currentRoom: null,
    initializeRoom: (room: CurrentRoom) => set((state) => ({ currentRoom: room })),
    addPlayer: (newPlayers: Player[]) => set((state) => ({
        currentRoom: {
            ...state.currentRoom!,
            players: newPlayers,
        }
    })),
    incrementTotalPlayers: () => set((state: RoomState) => ({
        currentRoom: {
            ...state.currentRoom!,
            totalPlayers: state.currentRoom?.totalPlayers ? state.currentRoom?.totalPlayers + 1 : 1
        }
    })),
    updateRoomSM: () => set((state: RoomState) => ({
        currentRoom: {
            ...state.currentRoom!,
            hasSM: true
        }
    })),
}));

export default useRoomStore;