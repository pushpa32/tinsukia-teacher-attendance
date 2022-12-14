import { connection } from "../connection.js";
import { query } from "../connection.js"
import moment from "moment/moment.js";

const upload = async (req, folder) => {
    const id = req.body.id
    if (!id)
        throw Error("ID  is required")

    const emp_check = await query('SELECT * FROM faculties WHERE id = ?', [id]);
    if (emp_check.length == 0)
        throw Error("Invalid ID")

    if (!req.files)
        throw Error("No file uploaded")

    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    let file = req.files.file
    const max_size = 5242880
    if (file.size > max_size) throw Error('Max file is 5MB')

    const fileName = new Date().getTime() + '_' + file.name
    const path = './public/upload/' + id.replaceAll('/', '_') + '/' + folder + '/' + fileName

    //Use the mv() method to place the file in upload path (i.e. "uploads")
    file.mv(path)

    return {
        name: fileName,
        path: req.headers.host + '/upload/' + id.replaceAll('/', '_') + '/' + folder + '/' + fileName,
        size: file.size
    }
}


export const uploadProfile = async (req, res) => {
    const out = {}
    try {
        const data = await upload(req, 'profile')
        const results = await query('UPDATE faculties SET profile_img = ? WHERE id = ?', [data.path, req.body.id]);

        out.message = "success"
        out.error = false
        out.data = data

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}