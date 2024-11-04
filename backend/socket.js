const { Server } = require('socket.io');
let io;
const userRooms = {};
module.exports.init = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        '*',
        'http://localhost:3000',
        'http://localhost:9999',
        'http://127.0.0.1:9999',
        'http://127.0.0.1:3000',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('joinUserRoom', (userId) => {
      console.log(`User join in room: ${userId}`);
      socket.join(userId);
      userRooms[socket.id] = userId;
    });

    // Event for joining community rooms
    socket.on('joinCommunityRooms', (communityIds) => {
      communityIds.forEach((communityId) => socket.join(communityId));
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
// exports.sendNotification = ({ recipientId, room, notification }) => {
//   // If a specific user ID is provided (single user)
//   if (recipientId) {
//     io.to(recipientId).emit('newNotification', notification);
//   }
//   // If a room name is provided (multiple users)
//   else if (room) {
//     console.log(room);
//     io.to(room).emit('newNotification', notification);
//   }
// };
// module.exports.getIO = () => io;
