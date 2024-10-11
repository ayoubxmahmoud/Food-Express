import express from "express"
import { allCustomers, getCustomer, loginUser, numberOfCustomers, registerUser, updateProfile } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js"
import multer from "multer";    

const userRouter = express.Router()

const storage = multer.diskStorage({
    // Specify the destination directory for uploaded files
    destination:"uploads/avatar/user",
    //Define the filename format for uploaded files
    filename:(req,file,cb) => {
        // Use the current timestamp and original file name
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})
const upload = multer({storage:storage})
userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/customers", allCustomers)
userRouter.put("/profile/update", authMiddleware, upload.single("avatar"), updateProfile)
userRouter.post("/profile", authMiddleware, getCustomer)
userRouter.get("/size", numberOfCustomers)

export default userRouter;
