import express from "express"
import authMiddleware from "../middleware/auth.js"
import { listOrders, numberOfOrders, placeOrder, removeOrder, updateStatus, userOrders, verifyOrder } from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder)
orderRouter.post("/verify", verifyOrder)
orderRouter.post("/user_orders", authMiddleware, userOrders)
orderRouter.get("/list",  listOrders)
orderRouter.post("/status",  updateStatus)
orderRouter.post("/remove", removeOrder)
orderRouter.get("/size", numberOfOrders)
export default orderRouter;