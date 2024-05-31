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

export type localstorageRoom = {
    roomId: string;
    playerId: string;
    playerName: string;
}

export type dbRoom = {
    [key: string]: {
        players: Player[];
        totalPlayers: number;
        red: {
            sm: Player;
            ops: Player[];
        };
        blue: {
            sm: Player;
            ops: Player[];
        }
    }
}
