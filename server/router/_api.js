import express from "express"
import { rol } from "../router/rol.js"
import { attendance } from "./attendance.js"
import { exportdata } from "./exportData.js"
import { upload } from "./upload.js"
import { user } from "./user.js"

export const api = express.Router()

api.use("/rol", rol)
api.use("/user", user)
api.use("/attendance", attendance)
api.use("/upload", upload)
api.use("/export", exportdata)