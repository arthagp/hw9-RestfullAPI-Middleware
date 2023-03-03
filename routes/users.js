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

// route.post('/users', (req, res) => {
//     console.log(req.body);
//     const {id, title, genres, year} = req.body
//     const query = `INSERT INTO users (id, title, genres, year)
//                    VALUES ($1, $2, $3, $4)`

//     pool.query(query, [id, title, genres, year], (error, result) => {
//         if(error) {
//             throw error
//         }
//         res.status(201).json({
//             message: "Insert Data Succesfuly"
//         })
//     })
// })

// route.put('/users/:id', (req, res) => {
//     console.log(req.body);
//     const {id} = req.params;
//     const {title, genres, year} = req.body
//     const query = `UPDATE movies
//                     SET title = $2,
//                         genres = $3,
//                         year = $4
//                     WHERE id = $1`

//     pool.query(query, [id, title, genres, year], (error, result) => {
//         if(error) {
//             throw error
//         }
//         res.status(200).json({
//             message: "Update Data Succesfuly"
//         })
//     })
// })

// route.delete('/users/:id', (req, res) => {
//     const {id} = req.params;
//     const findQuery = `SELECT * FROM movies WHERE id = $1`
//     pool.query(findQuery, [id], (error, result) => {
//         if(error) {
//             throw error
//         }
//         // mengecek apakah ada data yang akan di cari
//         if(result.rows[0]) {
//             const deleteQuery = `DELETE FROM movies
//             WHERE id = $1`

//             pool.query(deleteQuery, [id], (error, result) => {
//                 if(error) {
//                     throw error
//                 }
//                 res.status(200).json({
//                     message : "Delete Data Succesfuly"
//                 });
//             })
//         } else {
//             res.status(404).json({
//                 message : "Data Not Found"
//             })
//         }
//     })
// })


module.exports = route;