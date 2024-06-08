//imports
const express = require('express');
const { createServer } = require("http");
const socketIo = require("socket.io");
const cors = require('cors');
const { joinRoom, rooms, getRoom, loadCardPack, joinTeam } = require('./utils/featureUtils');

//config
const app = express();
app.use(cors())
const httpServer = createServer(app);
const io = socketIo(httpServer, {
    cors: { origin: "http://localhost:5173" }
});

//GET endpoint to fetch room details
app.get('/roomInfo/:roomId', (req, res) => {
    const { roomId } = req.params;
    const roomInfo = rooms[roomId];
    if (roomInfo) {
        res.send({ status: "success", data: roomInfo })
    } else {
        res.send({ status: "failed", data: "Room not found" })
    }
})

//Middleware to set the socketID to playerID passed from the frontend.
io.use((socket, next) => {
    const { playerId } = socket.handshake.query;
    if (!playerId) return next(new Error(`Invalid player ID => ${playerId}`));
    socket.id = playerId;
    next();
})

//Player connects
io.on('connection', (socket) => {
    console.log('A player connected', socket.id);
    const { roomId, playerId, playerName } = socket.handshake.query;

    //Join room
    socket.join(roomId);
    const roomState = joinRoom({ playerId, playerName, roomId });
    console.log('ROOM_JOINED', roomState)
    socket.emit('room_joined', roomState);

    //Card pack setup
    const cardPack = loadCardPack();
    socket.emit('pack_updated', cardPack);

    //Event handler to handle team joining action
    socket.on('join_team', ({ team, role, roomId, playerId, playerName }) => {
        const updatedRoom = joinTeam(team, role, roomId, playerId, playerName);
        socket.emit('room_updated', updatedRoom);
    })

    //Player disconnects
    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
    });
});

httpServer.listen(3000, () => console.log(`Server listening on 3000`));

