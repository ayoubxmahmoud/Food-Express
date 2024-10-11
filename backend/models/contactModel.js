import mongoose from "mongoose";

// Define a new Schema for the order collection in MongoDB
const contactSchema = new mongoose.Schema({
    // The user id, which is required string field
    username: {type:String, required:true},
    email: {type:String, required:true},
    subject: {type:String, required:true},
    message: {type:String, required:true}
})
// Create a model for order schema. If it already exists, use the existing model
const contactModel = mongoose.models.contact || mongoose.model("contact", contactSchema);

// Export the order model to be used in other parts of the application
export default contactModel;