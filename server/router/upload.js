import express from "express";
import {
    uploadProfile,
} from "../controller/upload.js";
import { verifyUser } from '../utils/verifyToken.js'
export const upload = express.Router();

upload.post("/profile", verifyUser, uploadProfile);

//404
upload.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});
