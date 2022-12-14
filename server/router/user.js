import express from 'express'
import { dashboardDetails, adminDashboard, getUsers, userRegisterByAdmin, getUser, updateDetails, getLatestTopFiveUser, getOwnDetail, updateAdminDetails, getPersonalData, updateAdminPassword } from '../controller/user.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

export const user = express.Router()

// user
user.post("/dashboard/details", verifyUser, dashboardDetails)
user.post("/update/details", verifyUser, updateDetails)
user.post("/get/detail", verifyUser, getOwnDetail)


//admin
user.post("/get/personal/info", verifyAdmin, getPersonalData)
user.post("/update/password", verifyAdmin, updateAdminPassword)
user.post("/update/admin/details", verifyAdmin, updateAdminDetails)
user.post("/register", verifyAdmin, userRegisterByAdmin)
user.post("/admin/dashboard/details", verifyAdmin, adminDashboard)
user.post("/get/users", verifyAdmin, getUsers)
user.post("/get/user", verifyAdmin, getUser)
user.post("/new/user/list", verifyAdmin, getLatestTopFiveUser)


//404
user.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})