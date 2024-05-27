import { ReactNode, createContext, useContext, useState } from "react";
import { Socket, io } from "socket.io-client";

type SocketContextProps = {
    socket: Socket | null;
    connect: (userId: string, roomId: string) => void;
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

    const connect = (userId: string, roomId: string) => {
        if (!socket) {
            const newSocket = io("http://localhost:3000", {
                query: { roomId, userId }
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