const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow this origin to access
    methods: ["GET", "POST"]
  }
});


io.on('connection', (socket) => {
  // console.log('What is socket', socket);
   // Join a specific room
   socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Leave a specific room
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });


  socket.on('chat', (payload) => {
    console.log('Received a chat message', payload);
    // Ensure payload has the roomId
    if(!payload.roomId) {
      console.error('No roomId specified in payload');
      return;
    }
    // Broadcast the message only to that specific room
    io.to(payload.roomId).emit("chat", payload);
  });
});



server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});