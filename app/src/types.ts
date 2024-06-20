//Global types

export type Player = {
    playerId: string;
    playerName: string;
}

export type Member = {
    role: 'op' | 'sm' | null;
} & Player;

export type LocalStorageRoom = {
    roomId: string;
    playerId: string;
    playerName: string;
}

export type TeamType = {
    sm: Member | null;
    ops: Member[];
    score: number;
}

export type TeamCardType = {
    team: 'red' | 'blue';
    members?: Member[];
    score: number;
    playerJoined: boolean;
}

export type CurrentTurn = {
    team: 'red' | 'blue' | null;
    state: 'guess' | 'giveClue' | null;
    wordsAllowedToGuess: number;
    clue: string;
}

export type CurrentRoom = {
    players: Player[];
    red: TeamType;
    blue: TeamType;
    hasGameStarted: boolean;
    currentTurn: CurrentTurn | null;
    winner: {
        team: 'red' | 'blue';
        reason: string;
    } | null
} | null;

export type CardType = {
    cardName: string;
    color: 'red' | 'blue' | 'black' | 'neutral';
    isFlipped: boolean;
}

export type CurrentPack = {
    name: string;
    cards: CardType[];
}