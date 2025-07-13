import express from "express";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.routes.js";
import cors from "cors";

import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";

import { app, server } from "./lib/socket.js";

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

const allowedOrigins =["https://full-stack-chat-app-6b5l.vercel.app","http://localhost:5173/"];

app.use(
  cors({
    origin: allowedOrigins,

    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the chat app",
    success: true,
    error: false,
  });
});

server.listen(PORT, () => {
  console.log("server is running on port:", PORT);
  connectDB();
});
