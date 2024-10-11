import mongoose from "mongoose";
import { seedCountries } from '../controllers/countriesController.js';

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://ayoubx1:ayoubx111@cluster0.pyb6n.mongodb.net/food_del_db')
    .then(() => {
        console.log('MongoDB connected');
        seedCountries();  // Seed countries after DB connection is established
      })
      .catch((err) => console.log('MongoDB connection error:', err));

}