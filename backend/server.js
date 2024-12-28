const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let users = {};

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', (username) => {
        users[socket.id] = username;
        io.emit('userList', Object.values(users));
    });

    socket.on('message', (data) => {
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('userList', Object.values(users));
    });
});

app.get('/', (req, res) => {
    res.send("Chat backend is running!");
});

server.listen(4000, '0.0.0.0', () => {
    console.log('Server is running on port 4000');
});