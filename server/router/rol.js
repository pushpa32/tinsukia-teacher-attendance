import express from 'express'
import { adminRegister, adminLogin, userLogin, checkPhoneNumberLogin } from '../controller/rol.js'

export const rol = express.Router()

// user
rol.post("/check/phone", checkPhoneNumberLogin)
rol.post("/otp/login", userLogin)

//Admins
rol.post("/admin/register", adminRegister)
rol.post("/admin/login", adminLogin)


//404
rol.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})