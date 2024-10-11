import express from "express"
// Importing cart controller functions for handling cart operation
import { addToCart, removeFromCart, getCart } from "../controllers/cartController.js"
import authMiddleware from "../middleware/auth.js";// Create a new router instance for handling cart-related routes
const cartRouter = express.Router();

// Define a Post route to add items to the cart
cartRouter.post("/add",authMiddleware, addToCart)
cartRouter.post("/remove",authMiddleware, removeFromCart)
cartRouter.post("/get",authMiddleware, getCart)

export default cartRouter;
