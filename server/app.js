//imports
const express = require('express');
const { createServer } = require("http");
const socketIo = require("socket.io");
const cors = require('cors');
const { joinRoom, rooms, getRoom } = require('./utils/featureUtils');

//config
const app = express();
app.use(cors())
const httpServer = createServer(app);
const io = socketIo(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
});

const joinTeam = (team, role, roomId, playerId) => {
    const room = getRoom(roomId);
    console.log(room);
    if (role === 'sm') {
        room[team][role] = playerId;
        room['hasSM'] = true;
    } else {
        room[team]['ops'] = room[team]['ops'] ? [...room[team]['ops'], playerId] : [playerId];
    }
    console.log(room);
    return room;
}

app.get('/roomInfo/:roomId', (req, res) => {
    const { roomId } = req.params;
    const roomInfo = rooms[roomId];
    if (roomInfo) {
        res.send({ status: "success", data: roomInfo })
    } else {
        res.send({ status: "failed", data: "Room not found" })
    }
})

io.use((socket, next) => {
    const { playerId } = socket.handshake.query;
    if (!playerId) {
        return next(new Error(`Invalid player ID => ${playerId}`));
    }
    socket.id = playerId;
    next();
})

io.on('connection', (socket) => {
    console.log('A player connected', socket.id);
    const { roomId, playerId, playerName } = socket.handshake.query;
    socket.join(roomId);
    const roomState = joinRoom({ playerId, playerName, roomId });
    console.log("Room state", roomState);
    socket.emit('room_joined', roomState);

    socket.on('join_team', ({ team, role, roomId, playerId }) => {
        const updatedRoom = joinTeam(team, role, roomId, playerId);
        socket.emit('room_updated', updatedRoom);
    })

    socket.on('message', (msg) => {
        socket.emit('message', 'Hello from server');
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
    });
});


httpServer.listen(3000, () => {
    console.log(`Server listening on 3000`);
});

