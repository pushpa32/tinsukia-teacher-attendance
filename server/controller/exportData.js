import pkg from 'xlsx';
import path from 'path'
import moment from 'moment'
import { connection } from "../connection.js";
import { query } from "../connection.js"
import { getDatesInRange } from './attendance.js';

function getTimestamp(arr, type) {
    if (arr) {
        for (let i = 0; i < arr.length; i++) {
            const att = arr[i]
            if (att.attendanceType === type) return att.timestamp
        }
    }

    return '-'
}

export function getRemark(checkin) {
    return (moment(checkin, 'LTS').isBefore(moment('10:01:00AM', 'LTS'))) ? 'On Time' : 'Late'
}

export const exportAttendance = async (req, res) => {
    const out = {}
    try {
        if (!req.body.date) throw new Error('Date is missing')
        const results = await query("SELECT id, name FROM faculties ORDER BY id ASC")

        const employees = []
        for (let i = 0; i < results.length; i++) {
            const emp = { ...results[i] }

            const attendance = await query("SELECT * FROM attendances WHERE user_id = ? AND date = ?", [results[i].id, req.body.date])

            emp.attendance = attendance
            for (let j = 0; j < attendance.length; j++) {
                emp.remark = attendance[j] ? "Present" : "Absent"
            }
            employees.push(emp)
        }

        var data = []
        employees.forEach(att => {
            const _data = { ...att }
            delete _data['attendance']
            _data.remark = _data.remark ? _data.remark : 'Absent'
            data.push(_data)
        })
        const file = pkg.utils.book_new()
        const attendance_sheet = pkg.utils.json_to_sheet(data)
        pkg.utils.book_append_sheet(file, attendance_sheet, "Attendance")
        pkg.writeFile(file, path.join('public/temp', (req.body.date + '-attendance.xlsx')))

        out.error = false
        out.message = 'success'
        out.data = req.headers.host + '/temp/' + (req.body.date + '-attendance.xlsx')

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const exportAttendanceByMonth = async (req, res) => {
    const out = {}
    try {
        if (!req.body.date) throw new Error('Date is missing')

        const date = new Date(req.body.date)
        const month = (date.getMonth() + 1) < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
        const year = date.getFullYear()
        const total_days = moment(year + "-" + month, "YYYY-MM").daysInMonth()

        const results = await query("SELECT id, name FROM faculties ORDER BY id ASC")

        const employees = []
        for (let i = 0; i < results.length; i++) {
            const emp = { ...results[i] }

            for (let j = 1; j <= total_days; j++) {
                const start_date = year + "-" + month + '-' + ((j < 9) ? ("0" + j) : j)

                const attendance = await query("SELECT * FROM attendances WHERE user_id = ? AND date = ?", [results[i].id, start_date])
                emp[start_date] = attendance.length > 0 ? "Present" : 'Absent'
            }
            employees.push(emp)
        }

        var data = []
        employees.forEach(emp => {
            const _data = { ...emp }
            data.push(_data)
        })

        const file = pkg.utils.book_new()
        const attendance_sheet = pkg.utils.json_to_sheet(data)
        pkg.utils.book_append_sheet(file, attendance_sheet, "Attendance")
        pkg.writeFile(file, path.join('public/temp', (month + '-attendance.xlsx')))

        out.error = false
        out.message = 'success'
        out.data = req.headers.host + '/temp/' + (month + '-attendance.xlsx')

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const exportAttendanceByRange = async (req, res) => {
    const out = {}
    try {
        if (!req.body.start_date) throw new Error('Start Date is missing')
        if (!req.body.end_date) throw new Error('End Date is missing')

        const d1 = new Date(req.body.start_date);
        const d2 = new Date(req.body.end_date);

        const start_date = getDatesInRange(d1, d2)

        const results = await query("SELECT id, name FROM faculties ORDER BY id ASC")

        const employees = []
        for (let i = 0; i < results.length; i++) {
            const emp = { ...results[i] }

            for (let j = 0; j < start_date.length; j++) {
                // const start_date = year + "-" + month + '-' + ((j < 9) ? ("0" + j) : j)

                const attendance = await query("SELECT * FROM attendances WHERE user_id = ? AND date = ?", [results[i].id, start_date[j]])
                emp[start_date[j]] = attendance.length > 0 ? "Present" : 'Absent'
            }
            employees.push(emp)
        }

        var data = []
        employees.forEach(emp => {
            const _data = { ...emp }
            data.push(_data)
        })

        const file = pkg.utils.book_new()
        const attendance_sheet = pkg.utils.json_to_sheet(data)
        pkg.utils.book_append_sheet(file, attendance_sheet, "Attendance")
        pkg.writeFile(file, path.join('public/temp', (req.body.start_date + "-to-" + req.body.end_date + '-attendance.xlsx')))

        out.error = false
        out.message = 'success'
        out.data = req.headers.host + '/temp/' + (req.body.start_date + "-to-" + req.body.end_date + '-attendance.xlsx')

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}
