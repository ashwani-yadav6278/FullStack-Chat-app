import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getMessages, getUsersForSidebar, sendMessages } from '../controllers/message.controller.js';

const router=express.Router();

router.get("/users",protectRoute,getUsersForSidebar);
router.post("/send/:id",protectRoute,sendMessages);
router.get("/:id",protectRoute,getMessages);



export default router;