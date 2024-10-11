import express from "express";
import { addFood, getFood, listFood, numberOfItems, removeFood, updateFood } from "../controllers/foodController.js";
import multer from "multer";

// Create a new router instance
const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    // Specify the destination directory for uploaded files
    destination:"uploads/food",
    //Define the filename format for uploaded files
    filename:(req,file,cb) => {
        // Use the current timestamp and original file name
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})
const upload = multer({storage:storage})

// Define the route to add a new food item
foodRouter.post("/add", upload.single("image"), addFood)
foodRouter.post("/remove", removeFood)
foodRouter.get("/list", listFood)
foodRouter.get("/get/:id", getFood)
foodRouter.post("/update/:id", upload.single("image"), updateFood)
foodRouter.get("/size", numberOfItems)


export default foodRouter;