import userModel from "../models/userModel.js"

// add items to user's cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({_id:req.userId});
        let cartData = userData.cartData;

        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId] = 1
        }else{
            cartData[req.body.itemId] += 1
        }
        await userModel.findByIdAndUpdate(req.userId, {cartData})
        res.json({success:true, message:"Item has been added to the cart"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error occured! when adding an item from the cart"})
    }
}

// remove items from user's cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({_id:req.userId})
        let cartData = userData.cartData
        if(cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        // Update the cart data of the current user
        await userModel.findByIdAndUpdate(req.userId, {cartData})
        res.json({success:true, message: "Item Deleted from the cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message: "Error when removing an item from the cart"})
    }
}

//fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({_id:req.userId})
        let cartData = userData.cartData
        res.json({success:true, cartData})

    } catch (error) {
        console.log(error);
        res.json({success:false, message: "Error when fetching items from the cart"})
    }
}

export {addToCart, removeFromCart, getCart}