import express from "express"
import { getAdmin, registerAdmin, loginAdmin, updateProfile, getAdminByEmail, sendEmail, verifyToken, resetPassword, generateToken, refreshToken } from "../controllers/adminController.js"
import authMiddleware from "../middleware/auth.js"
import multer from "multer";    

const adminRouter = express.Router()

const storage = multer.diskStorage({
    // Specify the destination directory for uploaded files
    destination:"uploads/avatar/admin",
    //Define the filename format for uploaded files
    filename:(req,file,cb) => {
        // Use the current timestamp and original file name
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})
const upload = multer({storage:storage})
adminRouter.post("/register", registerAdmin)
adminRouter.post("/login", loginAdmin)
adminRouter.get("/profile", authMiddleware, getAdmin)
adminRouter.get("/get", getAdminByEmail)
adminRouter.put("/profile/update", authMiddleware, upload.single("avatar"), updateProfile)
adminRouter.post("/auth/send-email", sendEmail)
adminRouter.post("/auth/reset-password", resetPassword)
adminRouter.post("/auth/generate-token", generateToken)
adminRouter.post("/auth/verify-token", verifyToken)
adminRouter.post("/auth/refresh-token", refreshToken)
export default adminRouter;
