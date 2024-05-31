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


const joinRoom = ({ playerId, playerName, roomId, team, role }) => {
    const doesPlayerExist = rooms[roomId]?.players?.find(player => player.playerId === playerId);
    if (!doesPlayerExist) {
        rooms[roomId] = {
            players: rooms[roomId]?.players ? [...rooms[roomId].players, { playerId, playerName }] : [{ playerId, playerName }],
            totalPlayers: rooms[roomId]?.totalPlayers ? rooms[roomId].totalPlayers + 1 : 1,
            red: [],
            blue: []
        }
    }
    console.log(rooms[roomId].players)
    console.log(rooms);
}

const joinTeam = (teamRole, room, player) => {
    teamRole = teamRole.split('-');
    console.log(rooms[room])
    if (teamRole[1] === 'sm') {
        rooms[room][teamRole[0]][teamRole[1]] = player;
        rooms[room]['hasSM'] = true;
    } else {
        rooms[room][teamRole[0]]['ops'] = rooms[room][teamRole[0]]['ops']?.push(player) ?? [player];
    }
    console.log(rooms[room]);
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
    console.log('A player connected:', socket.id);
    const { roomId, playerId, playerName } = socket.handshake.query;
    socket.join(roomId);
    joinRoom({ playerId, playerName, roomId, team: null, role: null });


    socket.on('join_team', (teamRole, room, playerId) => {
        joinTeam(teamRole, room, playerId);
        socket.emit('room_updated', rooms[room]);
    })

    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        socket.emit('message', 'Hello from server');
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
    });
});


httpServer.listen(3000, () => {
    console.log(`Server listening on 3000`);
});