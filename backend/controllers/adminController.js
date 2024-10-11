import adminModel from "../models/adminModel.js"; 
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create both access and refresh tokens
const createToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT secret is not defined");

  const accessToken = jwt.sign({ id }, secret, { expiresIn: '1h' }); // Short-lived token (e.g., 1 hour)
  const refreshToken = jwt.sign({ id }, secret, { expiresIn: '7d' }); // Long-lived token (e.g., 7 days)

  return { accessToken, refreshToken };
};

// Generate Token Endpoint
const generateToken = async (req, res) => {
  const { id } = req.body; 
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ success: false, message: 'JWT secret is not defined' });
  }

  try {
    const accessToken = jwt.sign({ id }, secret, { expiresIn: '1h' }); // Short-lived token (e.g., 1 hour)
    return res.json({ success: true, accessToken });
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({ success: false, message: "Error generating token" });
  }
};

// Verify Token Function
const verifyToken = (req, res) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }

  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, secret);
    return decoded.id;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

// Refresh Token Endpoint
const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token: newToken });
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

// Register Admin
const registerAdmin = async (req, res) => {
  const { firstName, lastName, password, email } = req.body;

  try {
    const exists = await adminModel.findOne({ email });
    if (exists) return res.json({ success: false, message: "Admin already exists" });

    if (!validator.isEmail(email)) return res.json({ success: false, message: "Please enter a valid email" });
    if (password.length < 8) return res.json({ success: false, message: "Please enter a strong password" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new adminModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const admin = await newAdmin.save();
    const { accessToken, refreshToken } = createToken(admin._id);

    res.json({ success: true, accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error occurred!" });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  console.log("login admin server");
  
  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) return res.json({ success: false, message: "Admin doesn't exist" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const { accessToken, refreshToken } = createToken(admin._id);
    console.log(accessToken, refreshToken);
    
    res.json({ success: true, accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error occurred!" });
  }
};

// Send Reset Password Email
const sendEmail = async (req, res) => {
  const { email, token } = req.body;
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `${process.env.BASE_URL}/auth/update-password?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Reset email sent to: " + email });
  } catch (error) {
    res.json({ success: false, message: "Error sending email: " + error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { password, token } = req.body;

  if (!password || !token) {
    return res.status(400).json({ success: false, message: "Token and password are required." });
  }

  const adminId = verifyToken(req, res);
  if (!adminId) {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }

  try {
    const user = await adminModel.findById(adminId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get Admin by Token
const getAdmin = async (req, res) => {
  try {
    const admin = await adminModel.findById(req.userId);
    res.json({ success: true, admin });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching admin data" });
  }
};

// Get Admin by Email
const getAdminByEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const admin = await adminModel.findOne({ email });
    if (admin) {
      res.json({ success: true, admin });
    } else {
      res.json({ success: false, message: "Admin not found!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching admin's data by email" });
  }
};

// Update Admin Profile
const updateProfile = async (req, res) => {
  try {
    const adminId = req.userId;
    let avatar_filename = req.file ? req.file.filename : null;

    const updatedData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      regionPhone: req.body.region_phone,
      phone: req.body.phone,
      address: {
        city: req.body.city,
        country: req.body.country,
      },
      ...(avatar_filename && { avatar: avatar_filename }),
    };

    const updatedAdmin = await adminModel.findByIdAndUpdate(adminId, { $set: updatedData }, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, message: "Profile updated successfully", admin: updatedAdmin });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  loginAdmin,
  registerAdmin,
  getAdmin,
  updateProfile,
  getAdminByEmail,
  sendEmail,
  generateToken,
  verifyToken,
  resetPassword,
  refreshToken
};
