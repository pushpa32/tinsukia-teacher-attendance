import { connection } from "../connection.js";
import { query } from "../connection.js"
import moment from "moment/moment.js";


export const HistoryByID = async (req, res) => {
    const out = {}

    connection.query("SELECT * FROM attendances WHERE user_id = ? AND date = ?", [req.body.user_id, req.body.date], async (err, result) => {

        if (err) throw err

        if (result.length <= 0) {
            out.message = "No such attendances"
            out.error = true
            out.data = []
            res.send(out)
        } else {
            out.message = "Success!"
            out.error = false
            out.data = result
            res.send(out)
        }
    })
};

export const SignIn = async (req, res) => {
    const out = {}

    let reason = ""
    if (!req.body.late_reason) reason = null
    else reason = req.body.late_reason

    const date = moment(new Date()).format("YYYY-MM-DD")
    const queryData = "INSERT INTO attendances (user_id, in_time, distance_in, late_reason, late_status, date) VALUES (?, ?, ?, ?, ?, ?)";

    connection.query(queryData, [req.body.user_id, req.body.in_time, req.body.distance_in, reason, req.body.late_status, date], async (err, result) => {

        if (err) throw err

        out.message = "Success!"
        out.error = false
        out.data = result
        res.send(out)

    })
};

export const SignOut = async (req, res) => {
    const out = {}

    connection.query("SELECT * FROM attendances WHERE user_id = ? AND date = ? AND out_time IS NULL", [req.body.user_id, req.body.date], async (err, result) => {
        if (err) throw err


        if (result.length <= 0) {
            out.message = "No such User"
            out.error = true
            out.data = null
            res.send(out)
        } else {
            const queryData = "UPDATE attendances SET out_time = ?, distance_out = ? WHERE user_id = ? AND date = ?"
            connection.query(queryData, [req.body.out_time, req.body.distance_out, req.body.user_id, req.body.date], async (err, data) => {

                if (err) throw err
                out.message = "Success!"
                out.error = false
                out.data = data
                res.send(out)

            })
        }
    })
};


export const HistoryByMonth = async (req, res) => {

    const out = {}

    const date = new Date(req.body.date)
    const month = (date.getMonth() + 1) <= 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    const year = date.getFullYear()
    const total_days = moment(year + "-" + month, "YYYY-MM").daysInMonth()

    let start_date = ""
    for (let i = 1; i <= total_days; i++) {
        if (i === total_days) start_date = start_date + "" + year + "-" + month + '-' + ((i <= 9) ? ("0" + i) : i) + ""
        else start_date = start_date + "" + year + "-" + month + '-' + ((i <= 9) ? ("0" + i) : i) + " "
    }
    start_date = start_date.split(' ');

    connection.query("SELECT * FROM attendances WHERE user_id = ? AND date IN (?) ORDER BY date ASC", [req.body.user_id, start_date], async (err, result) => {
        if (err) throw err
        for (let i = 0; i < start_date.length; i++) {
            for (let j = 0; j < result.length; j++) {
                if (result[j].date === start_date[i])
                    start_date[i] = result[j];
            }
            if (result[i])
                start_date[i] = { "date": start_date[i] }
            else
                start_date[i] = { "date": start_date[i] }
        }
        res.send(start_date)
    })
};

export const HistoryByDay = async (req, res) => {
    const out = {}

    connection.query("SELECT * FROM attendances JOIN faculties ON attendances.user_id = faculties.id WHERE attendances.date = ? AND attendances.user_id = ?", [req.body.date, req.body.user_id], async (err, result) => {
        if (err) throw err

        if (result.length === 0) {
            out.message = "No data"
            out.error = true
            out.data = null
        }
        else {
            out.message = "Success!"
            out.error = false
            out.data = result
        }
        res.send(out)
    })
};



//ADMIN
export const getAttendanceBydate = async (req, res) => {
    const out = {}

    connection.query("SELECT * FROM attendances JOIN faculties ON attendances.user_id = faculties.id WHERE attendances.date = ?", [req.body.date], async (err, result) => {
        if (err) throw err

        if (result.length === 0) {
            out.message = "No data"
            out.error = true
            out.data = null
        }
        else {
            out.message = "Success!"
            out.error = false
            out.data = result
        }


        res.send(out)
    })
};

export const getAttendanceByMonth = async (req, res) => {

    const date = new Date(req.body.date)
    const month = (date.getMonth() + 1) <= 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    const year = date.getFullYear()
    const total_days = moment(year + "-" + month, "YYYY-MM").daysInMonth()

    let start_date = ""
    for (let i = 1; i <= total_days; i++) {
        if (i === total_days) start_date = start_date + "" + year + "-" + month + '-' + ((i <= 9) ? ("0" + i) : i) + ""
        else start_date = start_date + "" + year + "-" + month + '-' + ((i <= 9) ? ("0" + i) : i) + " "
    }
    start_date = start_date.split(' ');

    let employees = []

    let emp = { "performance": [] }

    let status = ["Absent", "Present"]
    const results = await query('select * from faculties');

    for (let i = 0; i < results.length; i++) {
        emp = { ...results[i] }
        let arr = []
        for (let j = 0; j < total_days; j++) {
            const attendance = await query("SELECT * FROM attendances WHERE date  = ? AND user_id = ?", [start_date[j], results[i].id])
            arr[j] = { "id": j, "dates": start_date[j], 'att': status[attendance.length] }
        }
        emp.performance = arr
        employees.push(emp)
    }
    res.send(employees)
};


// range function
export function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate.getTime());

    const dates = [];

    while (date <= endDate) {
        dates.push(moment(new Date(date)).format("YYYY-MM-DD"));
        date.setDate(date.getDate() + 1);
    }

    return dates;
}

export const getAttendanceByRange = async (req, res) => {

    const d1 = new Date(req.body.start_date);
    const d2 = new Date(req.body.end_date);

    const start_date = getDatesInRange(d1, d2)

    let employees = []
    let emp = { "performance": [] }
    let status = ["Absent", "Present"]
    const results = await query('select * from faculties');

    for (let i = 0; i < results.length; i++) {
        emp = { ...results[i] }
        let arr = []
        for (let j = 0; j < start_date.length; j++) {
            const attendance = await query("SELECT * FROM attendances WHERE date  = ? AND user_id = ?", [start_date[j], results[i].id])
            arr[j] = { "id": j, "dates": start_date[j], 'att': status[attendance.length] }
        }
        emp.performance = arr
        employees.push(emp)
    }

    res.send(employees)
};