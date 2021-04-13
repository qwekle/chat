const express = require('express');
const app = express();
const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer, {
    cors: {
        origin: '*'
    }
});

app.use(express.json())

const rooms = new Map();

app.get('/rooms', (request, response) => {
    response.json(rooms)
})

app.post('/rooms', (request, response) => {
    const {roomId} = request.body;
    if (!rooms.has(roomId)) {
        rooms.set(
            roomId,
            new Map([
                ['users', new Map()],
                ['messages', []],
            ]),
        );
    }
    response.send();
});
io.on('connection', (socket) => {
    socket.on('ROOM:JOIN', ({roomId, userName}) => {
        socket.join(roomId);
        if (rooms.get(roomId)) {
            rooms.get(roomId).get('users').set(socket.id, userName);
            const users = [...rooms.get(roomId).get('users').values()];
            io.in(roomId).emit('ROOM:SET_USERS', users); // All users in room arr users
        }

    })

    socket.on('ROOM:NEW_MESSAGE', ({roomId, userName, text, dateMessage}) => {
        const obj = {
            userName,
            dateMessage,
            text
        }
        if (rooms.get(roomId)) {
            rooms.get(roomId).get('messages').push(obj);
        }
        io.in(roomId).emit('ROOM:NEW_MESSAGE', obj); // All users in room arr messages with new message
    })

    socket.on('disconnect', () => {
        rooms.forEach((room, roomId) => {
            if (room.get('users').delete(socket.id)) {
                const users = [...room.get('users').values()];
                socket.broadcast.to(roomId).emit('ROOM:SET_USERS', users); // alert about disconnect
            }
        })
    })
})

httpServer.listen(8888, (error) => {
    if (error) {
        throw Error(error)
    }
    console.log('Сервер запущен')
});




