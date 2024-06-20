// import { useEffect, useState } from "react"
// import { useSocket } from "../state/SocketContext"
// import { useParams } from "react-router-dom";
// import { createRandomEntity, activeRoom } from "../utils";
// import ActiveRoom from "../components/ActiveRoom";
// import React from "react";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";

// const Room = () => {
//     const [playerName, setPlayerName] = useState('');
//     const { connect } = useSocket();

//     useEffect(() => {
//         (async () => {
//             const currentRoom = activeRoom(roomId!)
//             currentRoom ? connect(currentRoom) : setIsNewMember(true);
//         })()
//     }, [])

//     const enterRoom = () => {
//         const playerId: string = createRandomEntity('player');
//         connect({ playerId, roomId: roomId!, playerName });
//         const rooms = localStorage.getItem('rooms');
//         if (rooms) {
//             const parsedRooms = JSON.parse(rooms);
//             parsedRooms[roomId!] = { roomId, playerId, playerName }
//             localStorage.setItem('rooms', JSON.stringify(parsedRooms))
//         } else {
//             localStorage.setItem('rooms', JSON.stringify({ [roomId!]: { playerId, roomId, playerName } }))
//         }
//         setIsNewMember(false);
//     }

//     if (isNewMember) {
//         return (
//             <div className="`flex flex-col items-center justify-center tracking-tight font-geist`">
//                 <h1 className="text-6xl font-bold text-white mb-2">Welcome to <span className="bg-gradient-to-r from-orange-700 to-indigo-700 bg-clip-text text-transparent">Codenames!</span></h1>
//                 <p className="text-2xl font-light opacity-50 text-white mb-10">Enter your player name to get started.</p>
//                 <Input type="text" className='w-1/2 text-xl h-12 mb-4' placeholder="Player ID" value={playerName} onChange={e => setPlayerName(e.target.value)} />
//                 <Button className="w-1/2 text-xl font-medium hover:bg-gradient-to-r hover:from-orange-700 hover:to-indigo-700 hover:text-foreground transition duration-200" size={"lg"} onClick={enterRoom}>Join room</Button>
//             </div>
//         )
//     }
//     return (
//         <ActiveRoom roomId={roomId!} />
//     )
// }

// export default Room