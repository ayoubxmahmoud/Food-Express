import express from "express";
import { getCountries } from "../controllers/countriesController.js";

const countriesRouter = express.Router()


countriesRouter.get("/fetch", getCountries)

export default countriesRouter;