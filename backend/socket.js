// socket.js
const { Server } = require('socket.io');
let io;
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:9999',
        'http://localhost:3000',
        'http://127.0.0.1:9999',
        'http://127.0.0.1:3000',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // transports: ['websocket'],
    // pingInterval: 1000 * 60 * 5,
    // pingTimeout: 1000 * 60 * 3,
  });

  // Listen for incoming socket connections
  io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);
    socket.on('joinRoom', (userId) => {
      console.log('User  join: ' + userId);
      socket.join(userId); // Join the room with the user's ID
    });
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User  disconnected: ' + socket.id);
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocket, getIo };
