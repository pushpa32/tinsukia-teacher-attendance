import { connection } from "../connection.js";
import crypto from "crypto";
import Jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

//user login
export const checkPhoneNumberLogin = async (req, res) => {

    const out = {}

    connection.query("SELECT * FROM faculties WHERE phone = ?", [req.body.phone], async (err, result) => {
        if (err) throw err

        if (result.length <= 0) {
            out.message = "Wrong Phone Number!"
            out.error = true
            out.data = null
            res.send(out)
        } else {
            out.message = "Success!"
            out.error = false
            out.data = "OK"
            res.send(out)
        }
    })
};

export const userLogin = async (req, res) => {

    connection.query("SELECT * FROM faculties WHERE phone = ?", [req.body.phone], async (err, result) => {
        if (err) throw err

        if (result.length <= 0) {
            res.send("User does not exists!")
        } else {
            const token = Jwt.sign({ user: result[0] }, 'PShady', { expiresIn: '30d' })
            res.cookie("access_token", token, {
                httpOnly: true
            }).status(200).json(token)
        }
    })
};

// Admin register
export const adminRegister = async (req, res) => {
    const out = {};

    connection.query("SELECT * FROM admins WHERE email = ?", [req.body.email], async (err, result) => {
        if (err) throw err
        if (result.length > 0) {
            out.message = "Email already exists!";
            out.error = true;
            out.data = null
            res.send(out)

        } else {
            const passName = req.body.name.substring(0, 3 + 1).toUpperCase();
            const passYear = "1996";

            //hashing plain  text password
            const hash = crypto
                .createHmac("sha256", process.env.PASSWORD_KEY)
                .update(passName + passYear)
                .digest("hex");
            connection.query("INSERT INTO admins (name, email, password)  VALUES (?, ?, ?)", [req.body.name, req.body.email, hash], (err, data) => {
                if (err) throw err;

                out.message = "success";
                out.error = false;
                out.data = data
                res.send(out)

            })
        }
    })
};

//Admin Login, HR, SuperAdmin
export const adminLogin = async (req, res) => {
    const out = {}
    connection.query("SELECT * FROM admins WHERE email = ?", [req.body.email], async (err, result) => {
        if (err) throw err

        if (result.length <= 0) {
            out.message = "Wrong email Id!";
            out.error = true;
            out.data = null
            res.send(out)
        } else {

            //hashing plain  text password
            const hash = crypto
                .createHmac("sha256", process.env.PASSWORD_KEY)
                .update(req.body.password)
                .digest("hex");

            if (hash === result[0].password) {
                const token = Jwt.sign({ user: result[0] }, 'PShady', { expiresIn: '30d' })

                res.cookie("access_token", token, {
                    httpOnly: true
                }).status(200).json({ "token": token, "error": false })
            } else {
                res.send({ "error": true, "message": "Wrong Password" })
            }
        }
    })
};
