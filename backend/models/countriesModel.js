import mongoose from "mongoose";

const countriesSchema = new mongoose.Schema({
    name: { type: String, required: true},
    code: { type: String, required: true},
    cities: { type: [String], required: true} // Array of cities
})

const countriesModel = mongoose.model("countries", countriesSchema);

export default countriesModel;