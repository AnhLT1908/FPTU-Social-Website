const { Server } = require('socket.io');

let io;
const userRooms = {};
module.exports.init = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
      ],
      credentials: true,
    },
  });
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    // Event for joining user-specific room
    socket.on('joinUserRoom', (userId) => {
      socket.join(userId);
      userRooms[socket.id] = userId;
    });

    // Event for joining community rooms
    socket.on('joinCommunityRooms', (communityIds) => {
      communityIds.forEach((communityId) => socket.join(communityId));
    });

    // Sending notification
    socket.on('sendNotification', (data) => {
      sendNotification(io, data);
    });
    socket.on('disconnect', () => {
      const userId = userRooms[socket.id];
      if (userId) {
        socket.leave(userId);
        delete userRooms[socket.id];
      }
      console.log('User disconnected:', socket.id);
    });
  });
};
// Socket notification
exports.sendNotification = ({ recipientId, room, notification }) => {
  // If a specific user ID is provided (single user)
  if (recipientId) {
    io.to(recipientId).emit('newNotification', notification);
  }
  // If a room name is provided (multiple users)
  else if (room) {
    io.to(room).emit('newNotification', notification);
  }
};
