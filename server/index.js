const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
});

io.on('connection', (socket) => {
    console.log(socket.handshake.query);
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.join(socket.handshake.query.roomId);
    socket.on("joinrooms", () => console.log("Joined room. Yipee"))
    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
});

httpServer.listen(3000, () => {
    console.log(`Server listening on ${3000}`);
});