//imports
const express = require('express');
const { createServer } = require("http");
const socketIo = require("socket.io");
const cors = require('cors');

//config
const app = express();
app.use(cors())
const httpServer = createServer(app);
const io = socketIo(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
});


//Rooms DB
const rooms = {};


const updateRoom = (userId, roomId) => {
    const doesPlayerExist = rooms[roomId]?.players?.find(playerId => playerId === userId);
    if (!doesPlayerExist) {
        rooms[roomId] = {
            players: rooms[roomId]?.players ? [...rooms[roomId].players, userId] : [userId],
            roomId,
            totalPlayers: rooms[roomId]?.totalPlayers ? rooms[roomId].totalPlayers + 1 : 1,
        }
    }
    console.log(rooms)
}


app.get('/roomInfo/:roomId', (req, res) => {
    // console.log("Hello");
    // console.log(req.params)
    const { roomId } = req.params;
    const roomInfo = rooms[roomId];
    console.log(rooms);
    if (roomInfo) {
        res.send({ status: "success", data: roomInfo })
    } else {
        res.send({ status: "failed", data: "Room not found" })
    }
})

io.use((socket, next) => {
    const { userId } = socket.handshake.query;
    if (!userId) {
        return next(new Error(`Invalid user ID => ${userId}`));
    }
    socket.id = userId;
    next();
})

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    const { roomId, userId } = socket.handshake.query;
    socket.join(roomId);
    updateRoom(userId, roomId);
    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        socket.emit('message', 'Hello from server');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


httpServer.listen(3000, () => {
    console.log(`Server listening on 3000`);
});