// Creates the connection to the database, uses dotenv to provide credentials
const mysql = require('mysql2/promise');

require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME
    },
    console.log('Connecting to the database.')
);

module.exports = db;