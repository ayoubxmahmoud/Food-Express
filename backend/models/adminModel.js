import mongoose from "mongoose";

// Define the address schema
const addressSchema = new mongoose.Schema({
  city: { type: String },
  country: { type: String },
  street: { type: String }
});

// Define the user schema
const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  address: { type: addressSchema },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { minimize: false });

// Register the model unconditionally
const adminModel = mongoose.model("admin", adminSchema);

export default adminModel;
