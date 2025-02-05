const mysql = require('mysql')
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Could*Wrong*48",
    database:"blog_posts" 
})

module.exports = db;