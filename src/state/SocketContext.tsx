import { ReactNode, createContext, useContext, useState } from "react";
import { Socket, io } from "socket.io-client";

type SocketContextProps = {
    socket: Socket | null;
    connect: ({ playerId, roomId, playerName }: { playerId: string, roomId: string, playerName: string }) => void;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = (): SocketContextProps => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SockerProvider')
    }
    return context;
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<null | Socket>(null);

    const connect = ({ playerId, roomId, playerName }: {
        playerId: string,
        roomId: string,
        playerName: string
    }) => {
        if (!socket) {
            const newSocket = io("http://localhost:3000", {
                query: { roomId, playerId, playerName, role: null }
            });
            setSocket(newSocket);
        }
    }

    return (
        <SocketContext.Provider value={{ socket, connect }} >
            {children}
        </SocketContext.Provider>
    )
}