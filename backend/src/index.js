
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.routes.js'
import cors from 'cors';
import path from 'path'// for deploy


import connectDB from './lib/db.js'
import cookieParser from 'cookie-parser'

import { app,server } from './lib/socket.js';




const PORT=process.env.PORT ||5000;

const __dirname=path.resolve();// for deploy

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true, limit: '10mb'}))
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
})
);

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

// for deploy
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist"))); 

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
    })
}

server.listen(PORT,()=>{
    console.log('server is running on port:',PORT);
    connectDB();
})