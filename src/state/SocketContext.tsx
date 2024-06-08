import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import useRoomStore, { RoomState } from "./roomStore";

type SocketContextProps = {
    socket: Socket | null;
    connect: ({ playerId, roomId, playerName }: { playerId: string, roomId: string, playerName: string }) => void;
    setSocket: Dispatch<SetStateAction<Socket | null>>;
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
    const initializeRoom = useRoomStore((state: RoomState) => state.initializeRoom);
    const initializePack = useRoomStore((state: RoomState) => state.initializePack);
    const currentRoom = useRoomStore((state: RoomState) => state.currentRoom);
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

    useEffect(() => {
        socket?.on('room_updated', (room) => {
            console.log(room);
        })
        socket?.on('room_joined', (room) => {
            initializeRoom(room);
        })
        socket?.on('pack_updated', (pack) => {
            initializePack(pack);
        })
    }, [socket, currentRoom])

    return (
        <SocketContext.Provider value={{ socket, connect, setSocket }} >
            {children}
        </SocketContext.Provider>
    )
}