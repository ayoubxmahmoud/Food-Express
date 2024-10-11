import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"


// Tokens provide a far more secure method for user authentication because 
// they are self-contained, and only the server that created the token can verify it.
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}
// register user
const registerUser = async (req, res) => {
    const {name, password, email} = req.body;
    try {
        // checking is user already exists
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success:false, message: "User already exists"})
        }
        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({success:false, message:"Please enter a valid email"})
        }
        if (password.lenght < 8) {
            return res.json({success:false, message: "Please enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id);
        res.json({success:true, token})
    } catch (error) {
        console.log(error)
        res.json({success:false, message: "Error occured!"})
    }
}


// login user
const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success:false, message: "User doesn't exist"})
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.json({success:false, message:"Invalid credentials"})
        }
        const token = createToken(user._id);
        res.json({success:true, token})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error occured!"})
    }
}
// fetch all customers
const allCustomers = async (req, res) => {
    try {
        const customers = await userModel.find({});
        res.json({success:true, customers});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"error! fetching customers"})
    }
}

const numberOfCustomers = async (req, res) => {
    try {
        const size = (await userModel.find({})).length;
        res.json({size})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error:'An error occured'});
    }
}
// Get a specific customer
const getCustomer = async (req, res) => {
    try {
        const customer = await userModel.findById(req.userId);
        res.json({success:true, customer})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error! fetching customer's data"})
    }
}

// Update user profile
const updateProfile = async (req, res) => {
    try {
        // Use the userId attached by authMiddleware
        const userId = req.userId; // Access userId from req.userId, not req.body
        console.log("Updating profile for user ID:", userId);
        
        // Initialize the avatar filename if a file is uploaded
        let avatar_filename = req.file ? req.file.filename : null;

        // Prepare the updated user data
        const updatedData = {
            name: req.body.name,
            email: req.body.email,
            regionPhone: req.body.region_phone,
            phone: req.body.phone,
            address: {
                street: req.body['street'],
                city: req.body['city'],
                country: req.body['country'],
            },
            ...(avatar_filename && { avatar: avatar_filename }), // Only add avatar if a file was uploaded
        };
        console.log(updatedData);
        

        // Find the user by ID and update their profile
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updatedData },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Send success response with updated user data
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


  

export {loginUser, registerUser, allCustomers, getCustomer, updateProfile, numberOfCustomers}