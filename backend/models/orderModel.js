import mongoose from "mongoose";

// Define a new Schema for the order collection in MongoDB
const orderSchema = new mongoose.Schema({
    // The user id, which is required string field
    userId: {type:String, required:true},
    items: {type:Array, required:true},
    amount: {type:Number, required:true},
    address: {type:Object, required:true},
    status: {type:String, default:"Food Processing"},
    date: {type:Date, default:Date.now()},
    payment: {type:Boolean, default:false}
})
// Create a model for order schema. If it already exists, use the existing model
const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

// Export the order model to be used in other parts of the application
export default orderModel;