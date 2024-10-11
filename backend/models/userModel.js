import mongoose from "mongoose";

// Define the address schema
const addressSchema = new mongoose.Schema({
  city: { type: String },
  country: { type: String },
  street: { type: String }
});

// Define the user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  address: { type: addressSchema },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  cartData: { type: Object, default: {} },
}, { minimize: false });

// Register the model unconditionally
const userModel = mongoose.model("user", userSchema);

export default userModel;
