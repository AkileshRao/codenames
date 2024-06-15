//imports
const express = require('express');
const { createServer } = require("http");
const socketIo = require("socket.io");
const cors = require('cors');
const { joinRoom, rooms, logs, getRoom, loadCardPack, joinTeam, giveClue, addToLogs, startGame, cardFlip, resetRoom } = require('./utils/featureUtils');

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
    const { roomId, playerId, playerName } = socket.handshake.query;
    console.log(`Player ${playerName} connected`);

    //Join room
    socket.join(roomId);
    const roomState = joinRoom({ playerId, playerName, roomId });
    socket.emit('room_joined', roomState);
    socket.emit('update_logs', logs[roomId]);

    //Card pack setup
    const cardPack = loadCardPack();
    socket.emit('pack_updated', cardPack);

    //Event handler to handle team joining action
    socket.on('join_team', ({ team, role, roomId, playerId, playerName }) => {
        console.log(team, role, roomId, playerId, playerName)
        const updatedRoom = joinTeam(team, role, roomId, playerId, playerName);
        io.to(roomId).emit('room_updated', updatedRoom)
        io.to(roomId).emit('update_logs', logs[roomId])
    })

    socket.on('start_game', (roomId) => {
        const updatedRoom = startGame(roomId);
        io.to(roomId).emit('room_updated', updatedRoom)
    })

    socket.on('card_flip', (card, roomId, playerName, currentTurn) => {
        const { cardPack, room } = cardFlip(card, roomId, playerName, currentTurn);
        io.to(roomId).emit('pack_updated', cardPack)
        io.to(roomId).emit('room_updated', room)
    })

    socket.on('give_clue', (sm, updatedTurn) => {
        const updatedRoom = giveClue(roomId, sm, updatedTurn);
        io.to(roomId).emit('room_updated', updatedRoom);
    })

    socket.on('reset_game', (roomId) => {
        const { room, cardPack } = resetRoom(roomId);
        io.to(roomId).emit('room_updated', room)
        io.to(roomId).emit('pack_updated', cardPack)
        io.to(roomId).emit('update_logs', logs[roomId])
    })

    //Player disconnects
    socket.on('disconnect', () => {
        console.log(`Player ${playerName} disconnected`);
    });
});

httpServer.listen(3000, () => console.log(`Server listening on 3000`));

