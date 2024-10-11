import foodModel from "../models/foodModel.js";
import fs from "fs"

// add food item
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;
    console.log(req.body)
    const food = foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })

    try {
        await food.save();
        res.json({success:true,message:"Food Added"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Failed adding the product."})

    }
}

const getFood = async (req, res) => {
    try {
      const foodId = req.params.id;
  
      // Find the food item by its ID
      const food = await foodModel.findById(foodId);
  
      // Check if the food item exists
      if (!food) {
        return res.status(404).json({ success: false, message: `Food with id ${foodId} not found.` });
      }
  
      // Send the found food item in the response
      res.json({ success: true, food });
    } catch (error) {
      console.error('Error fetching food:', error);
      res.status(500).json({ success: false, message: `Error fetching food item` });
    }
  };
  
  const updateFood = async (req, res) => {
    try {
      const foodId = req.params.id;
      console.log(`Updating food with ID: ${foodId}`);
      
      // Find the food item
      let food = await foodModel.findById(foodId);
      
      if (!food) {
        return res.status(404).json({ success: false, message: `Food with id ${foodId} not found.` });
      }
      
      // Check if an image file was uploaded
      if (req.file) {
        const imagePath = req.file.filename;  // multer stores the file under req.file
        req.body.image = imagePath;  // Set the new image path in req.body
      }
  
      // Update the food item with the new data
      food = await foodModel.findByIdAndUpdate(foodId, req.body, { new: true });
      
      res.json({ success: true, message: "The food item has been updated successfully", food });
    } catch (error) {
      console.error('Error updating food:', error);
      res.status(500).json({ success: false, message: 'Error updating food item' });
    }
  };
  
  
// get the list foods from db
const listFood = async (req,res) => {
    try {
        const foods = await foodModel.find({});
        res.json({success:true, foods})
    } catch (error) {
        console.log(error);
        res.json({success:false, data:"Error"})
    }
}
const numberOfItems = async (req, res) => {
  try {
      const size = (await foodModel.find({})).length;
      res.json({size})
  } catch (error) {
      console.log(error);
      res.status(500).json({ error:'An error occured'});
  }
}
// remove a spycific food item from db
const removeFood = async (req,res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => {})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Food removed"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}
export {addFood, listFood, removeFood, getFood, updateFood, numberOfItems}