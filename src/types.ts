//Global types

export type Member = {
    playerId: string;
    playerName: string;
    role: 'op' | 'sm' | null;
}

export type Player = {
    playerId: string;
    playerName: string;
}

export type LocalStorageRoom = {
    roomId: string;
    playerId: string;
    playerName: string;
}

export type dbRoom = {
    [key: string]: {
        players: Player[];
        totalPlayers: number;
        red: TeamMembers;
        blue: TeamMembers
    }
}

export type TeamMembers = {
    sm: Player | null;
    ops: Player[];
}