import express from 'express'
import { HistoryByID, SignIn, SignOut, HistoryByMonth, getAttendanceBydate, getAttendanceByMonth, getAttendanceByRange, HistoryByDay } from '../controller/attendance.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

export const attendance = express.Router()

// attendance
attendance.post("/history/by/id", verifyUser, HistoryByID)

attendance.post("/signin", verifyUser, SignIn)
attendance.post("/signout", verifyUser, SignOut)
attendance.post("/history/byMonth", verifyUser, HistoryByMonth)
attendance.post("/history/byday", verifyUser, HistoryByDay)

//admin
attendance.post("/get/bydate", verifyAdmin, getAttendanceBydate)
attendance.post("/get/bymonth", verifyAdmin, getAttendanceByMonth)
attendance.post("/get/byrange", verifyAdmin, getAttendanceByRange)




//404
attendance.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})