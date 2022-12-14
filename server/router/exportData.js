import express from "express";
import { exportAttendance, exportAttendanceByMonth, exportAttendanceByRange } from "../controller/exportData.js";

export const exportdata = express.Router();

exportdata.post('/attendance', exportAttendance)

exportdata.post('/attendance/month', exportAttendanceByMonth)

exportdata.post('/attendance/range', exportAttendanceByRange)

//404
exportdata.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});
