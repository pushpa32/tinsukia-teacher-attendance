import dotenv from "dotenv"
import mysql from 'mysql'
import util from 'util'
dotenv.config()


const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT


export const connection = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE,
    user: DB_USER,
    password: DB_PASSWORD
});


export const query = util.promisify(connection.query).bind(connection)
connection.getConnection((err, connection) => {
    if (err)
        throw err;
    console.log('Database connected successfully');
    connection.release();
});



// export default query, connection