import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
// used to store online Users
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = new Set();
    }
    userSocketMap[userId].add(socket.id);
  }

  //io.emit is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("typing", ({ receiverId }) => {
    const receiverSocketIdSet = getReceiverSocketId(receiverId);
    if (receiverSocketIdSet) {
      for (let socketId of receiverSocketIdSet) {
        io.to(socketId).emit("typing", {
          senderId: socket.handshake.query.userId,
        });
      }
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketIdSet = getReceiverSocketId(receiverId);
    if (receiverSocketIdSet) {
      for (let socketId of receiverSocketIdSet) {
        io.to(socketId).emit("stopTyping", {
          senderId: socket.handshake.query.userId,
        });
      }
    }
  });

  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId]) {
      //We only remove the tab that disconnected, not the whole user.
      userSocketMap[userId].delete(socket.id);
      if (userSocketMap[userId].size === 0) {
        delete userSocketMap[userId]; //If no more tabs left, remove user from online list
      }
    }
    // Emit updated online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
export { io, app, server };
