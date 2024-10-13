import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import dotenv from 'dotenv';
dotenv.config();

// Importing the stripe package to handle the payment processing
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
// Function to handle placing a user's order from the fronend
const placeOrder = async (req, res) => {
    const frontend_url = "https://food-express-qomz.onrender.com/";
    try {
        console.log(req.userId);

        // Calculate total amount from items and delivery charges
        const totalAmount = req.body.items.reduce((acc, item) => acc + item.price * item.quantity, 0) + 2;

        // Create a new order model
        const newOrder = new orderModel({
            userId: req.userId,
            items: req.body.items,
            amount: totalAmount, // Use calculated total amount
            address: req.body.address
        });

        // Save the new order to the database
        await newOrder.save();

        // Clear the user's cart data after placing the order
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        // Create line items for each product to be passed to Stripe
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "mad",
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 9.74 * 100) // Ensure correct amount
            },
            quantity: item.quantity
        }));

        // Add delivery charges as a separate line item
        line_items.push({
            price_data: {
                currency: "mad",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: Math.round(2 * 9.74 * 100)
            },
            quantity: 1
        });

        // Create a new Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        // Send session URL back to the frontend
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error when placing the order!" });
    }
};

// Function to verify the status of an order item when processing the order
const verifyOrder = async (req, res) => {
    // Extract the orderId and success status from the request body
    const {orderId, success} = req.body;
    try {
        // If the payment was successful 
        if(success =="true"){
            // Update the order in the database to mark it as paid
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            // Respond with a success message
            res.json({success:true, message:"Paid"})
        }else{
            // If the payment was not successful, delete the order from the database
            await orderModel.findByIdAndDelete(orderId);
            // Response with a failure message
            res.json({success:false, message:"Not Paid"})
        }
    } catch (error) {
        // Log any errors that occur during the process
        console.log(error);
        res.json({success:false, message:"Error!"})
    }
}
// user orders for the frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId:req.userId});
        res.json({success:true, orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error!"})
    }
}

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true, data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Failed fetching orders!"})
    }
}

// Function to update order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
        res.json({success:true, message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Failed update the status"})
    }
}

// Function to remove an order
const removeOrder = async (req, res) => {
    try {
        const response = await orderModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:"The order has been deleted successfully "})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Failed deleting the order!"})
    }
}
const numberOfOrders = async (req, res) => {
    try {
        const size = (await orderModel.find({})).length;
        res.json({size})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error:'An error occured'});
    }
}
export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus, removeOrder, numberOfOrders}
