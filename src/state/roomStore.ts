import { create } from "zustand";
import { CurrentPack, CurrentRoom, Player, TeamType } from "../types";

export type RoomState = {
    currentRoom: CurrentRoom | null;
    currentPack: CurrentPack | null;
    updateRoom: (room: CurrentRoom) => void;
    initializePack: (pack: CurrentPack) => void;
    addPlayer: (newPlayers: Player[]) => void;
    // joinTeam: () => void;
}

const useRoomStore = create<RoomState>((set) => ({
    currentRoom: null,
    currentPack: null,
    updateRoom: (room: CurrentRoom) => set(({ currentRoom: room })),
    initializePack: (pack: CurrentPack) => set(({ currentPack: pack })),
    addPlayer: (newPlayers: Player[]) => set((state) => ({
        currentRoom: {
            ...state.currentRoom!,
            players: newPlayers,
        }
    })),
}));

export default useRoomStore;