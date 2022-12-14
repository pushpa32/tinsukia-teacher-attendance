import express from "express"
import cookieParser from 'cookie-parser'
import cors from "cors"
import { api } from "./router/_api.js"
import "./connection.js"
import path from 'path'
import { fileURLToPath } from 'url'
import fileUpload from 'express-fileupload'

const PORT = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.static(path.join(__dirname, './build')))


app.use(fileUpload({
    createParentPath: true
}));


app.use(
    cors({
        origin: "*",
        methods: ['GET', 'POST'],
        credentials: true
    })
)

app.use(express.static('public'));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.listen(PORT,
    () => console.log(`Server Started on port ${PORT}...`))

//api: for api
app.use("/api", api)

// frontend
app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, './build/index.html'))
})