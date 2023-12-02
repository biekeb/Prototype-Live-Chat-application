const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

const PORT = process.env.PORT || 3001;

const users = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`User connected with ID: ${socket.id}`);

  socket.on('join', (username) => {
    users[socket.id] = username;
    io.emit('updateUsers', Object.values(users));
  });

  socket.on('getAvailableUsers', () => {
    io.emit('updateAvailableUsers', Object.values(users)); // Broadcast to all connected sockets
  });

  socket.on('sendMessage', ({ message, to }) => {
    io.to(to).emit('message', { message, from: socket.id });
  });

  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('updateUsers', Object.values(users));
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
