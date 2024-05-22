const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
const { log } = require('console');
const app = express();

app.use(cors())
const rooms = [];

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
});

io.use((socket, next) => {
    const { socketId } = socket.handshake.query;
    if (socketId) {
        socket.id = socketId;
    }
    next();
})

io.on('connection', (socket) => {
    const { handshake: { query: { roomId } } } = socket;
    if (rooms.indexOf(roomId) < 0) rooms.push(socket.handshake.query.roomId);
    socket.join(socket.handshake.query.roomId);
    console.log(`⚡: ${socket.handshake.query.name} just joined ${socket.handshake.query.roomId}!`);
    socket.to(roomId).emit("hello")
    socket.on('dummy', () => {
        console.log("Checking broadcast");
    })
    socket.on('disconnect', () => {
        console.log(`${socket.handshake.query.name} disconnected!`);
    });


});


app.get('/rooms', (req, res) => {
    res.json({
        rooms
    })
})

httpServer.listen(3000, () => {
    console.log(`Server listening on 3000`);
});