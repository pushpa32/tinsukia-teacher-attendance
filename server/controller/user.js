import { connection } from "../connection.js";
import moment from "moment"
import { query } from "../connection.js"
import crypto from "crypto";
import dotenv from "dotenv"

dotenv.config()

//USER
export const dashboardDetails = async (req, res) => {
    const out = {}

    connection.query("SELECT * FROM attendances WHERE user_id = ? AND date = ?", [req.body.user_id, req.body.date], async (err, result) => {
        if (err) throw err

        if (result.length <= 0) {
            out.message = "No such attendances"
            out.error = true
            out.data = null
            res.send(out)
        } else {
            out.message = "Success!"
            out.error = false
            out.data = result[0]
            res.send(out)
        }
    })
};

export const updateDetails = async (req, res) => {
    const out = {}

    var sub = JSON.stringify(req.body.subject);

    connection.query("UPDATE faculties SET dob = ?, gender = ?, maritial_status = ?, caste = ?, highest_qualification = ?, specialization = ?, department = ?, subject = ?, address = ?, district = ?, pin_code = ?, state = ? WHERE id = ?", [req.body.dob, req.body.gender, req.body.maritial_status, req.body.caste, req.body.highest_qualification, req.body.specialization, req.body.department, sub, req.body.address, req.body.district, req.body.pin_code, req.body.state, req.body.user_id], async (err, result) => {
        if (err) throw err

        if (result.length <= 0) {
            out.message = "No such attendances"
            out.error = true
            out.data = null
            res.send(out)
        } else {
            out.message = "Success!"
            out.error = false
            out.data = result[0]
            res.send(out)
        }
    })
};

export const getOwnDetail = async (req, res) => {
    const out = {}

    connection.query("SELECT * FROM faculties WHERE id = ?", [req.body.user_id], async (err, result) => {
        if (err) throw err

        out.message = "Success!"
        out.error = false
        out.data = result[0]
        res.send(out)
    })
};


//ADMIN
export const getPersonalData = async (req, res) => {
    const out = {}

    connection.query("SELECT * FROM admins WHERE id = ?", [req.body.id], async (err, result) => {
        if (err) throw err

        if (result.length <= 0) {
            out.message = "No such attendances"
            out.error = true
            out.data = null
            res.send(out)
        } else {
            out.message = "Success!"
            out.error = false
            out.data = result[0]
            res.send(out)
        }
    })
};

export const updateAdminDetails = async (req, res) => {
    const out = {}

    connection.query("UPDATE admins SET name = ?, email = ? WHERE id = ?", [req.body.name, req.body.email, req.body.id], async (err, result) => {
        if (err) throw err

        if (result.length <= 0) {
            out.message = "No such attendances"
            out.error = true
            out.data = null
            res.send(out)
        } else {
            out.message = "Success!"
            out.error = false
            out.data = result[0]
            res.send(out)
        }
    })
};

export const updateAdminPassword = async (req, res) => {
    const out = {}

    const admin = await query("SELECT * FROM admins WHERE id  = ?", [req.body.id])
    const hash = crypto
        .createHmac("sha256", process.env.PASSWORD_KEY)
        .update(req.body.old_password)
        .digest("hex");

    if (hash === admin[0].password) {
        const hashed = crypto
            .createHmac("sha256", process.env.PASSWORD_KEY)
            .update(req.body.new_password)
            .digest("hex");
        const result = await query("UPDATE admins SET password = ? WHERE id = ?", [hashed, req.body.id])

        out.message = "Success!"
        out.error = false
        out.data = result
        res.send(out)
    } else {
        out.message = "The old password is wrong!"
        out.error = true
        out.data = null
        res.send(out)
    }
};


export const userRegisterByAdmin = async (req, res) => {
    const out = {}

    connection.query("SELECT * FROM faculties WHERE phone = ?", [req.body.phone], async (err, result) => {
        if (err) throw err

        if (result.length > 0) {
            out.message = "User already exists with this phone number!"
            out.error = true
            out.data = null
            res.send(out)
        } else {
            connection.query("INSERT INTO faculties (name, email, phone)  VALUES (?, ?, ?)", [req.body.name, req.body.email, req.body.phone], async (err, data) => {
                out.message = "Success!"
                out.error = false
                out.data = data
                res.send(out)
            })
        }
    })
};

export const adminDashboard = async (req, res) => {
    const out = {}

    connection.query("SELECT * FROM faculties", [], async (err, result) => {
        if (err) throw err
        const dd = moment(new Date()).format("YYYY-MM-DD")
        connection.query("SELECT * FROM attendances WHERE date =? ", [dd], async (err, data) => {
            if (err) throw err
            connection.query("SELECT * FROM faculties WHERE created_at =? ", [dd], async (err, registerUser) => {
                if (err) throw err

                out.message = "Success!"
                out.error = false
                out.data = [
                    result,
                    data,
                    registerUser
                ]
                res.send(out)

            })
        })
    })
};

export const getUsers = async (req, res) => {
    const out = {}

    connection.query("SELECT * FROM faculties", [], async (err, result) => {
        if (err) throw err

        out.message = "Success!"
        out.error = false
        out.data = result
        res.send(out)
    })
};

export const getUser = async (req, res) => {
    const out = {}

    connection.query("SELECT * FROM faculties WHERE id = ?", [req.body.user_id], async (err, result) => {
        if (err) throw err

        out.message = "Success!"
        out.error = false
        out.data = result[0]
        res.send(out)
    })
};

export const getLatestTopFiveUser = async (req, res) => {
    const out = {}

    connection.query("SELECT * FROM faculties ORDER BY created_at DESC LIMIT 5", [], async (err, result) => {
        if (err) throw err

        out.message = "Success!"
        out.error = false
        out.data = result
        res.send(out)
    })
};

