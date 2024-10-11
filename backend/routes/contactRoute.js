import express from "express"
import authMiddleware from "../middleware/auth.js"
import { contact } from "../controllers/contactController.js";


const contactRouter = express.Router();
contactRouter.post("/send_message", authMiddleware, contact)

export default contactRouter;
