const express = require('express');
const route = express.Router();
const pool = require('../connectDb');

// GET, POST, DELETE, PUT in users table

route.get('/users', (req, res) => {
    const query = `SELECT * FROM users`;

    pool.query(query, (error, result) => {
        if(error) throw error
        res.status(200).json(result.rows);
    })
})


module.exports = route;