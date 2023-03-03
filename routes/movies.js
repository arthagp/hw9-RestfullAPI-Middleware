const express = require('express');
const route = express.Router();
const pool = require('../connectDb');

//PAGINATE
route.get("/movies", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
  
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    const results = {};
  
    //menghitung total data yang tersedia di database
    try {
      const countResult = await pool.query("SELECT COUNT(*) FROM movies");
      const count = countResult.rows[0].count;
      results.totalCount = count;
  
      //mengambil data film dari database dengan teknik pagination
      const result = await pool.query(
        `SELECT * FROM movies ORDER BY id OFFSET ${startIndex} LIMIT ${limit}`
      );
      results.data = result.rows;
  
      //mengatur halaman sebelumnya dan halaman selanjutnya
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit,
        };
      }
      if (endIndex < count) {
        results.next = {
          page: page + 1,
          limit: limit,
        };
      }
      res.status(200).json(results.data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

// GET, POST, DELETE, PUT in movies table

route.get('/movies/:id', (req, res) => {
    const {id} = req.params;
    
    const getMoviesID = `SELECT * FROM movies
                        WHERE id = $1`
    pool.query(getMoviesID, [id], (error, result) => {
        if(error) {
            throw error
        } else if(result.rows[0]) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({
                message: "Data Not Found"
            })
        }
    })
})

route.post('/movies/:id', (req, res) => {
    // jika data id yang di ditambahkan sudah ada maka the data is exist
    // jika tidak ada maka berhasil menambahkan data
    const {id} = req.params
    const getMoviesExist = `SELECT * FROM movies WHERE id = $1`

    pool.query(getMoviesExist, [id], (error, result) => {
        if(error) {
            throw error
        } else if (result.rows[0]){
            res.status(200).json({
                message: "The Data is Exist"
            })
        } else {
            const {id, title, genres, year} = req.body
            const queryInsert = `INSERT INTO movies (id, title, genres, year)
                         VALUES ($1, $2, $3, $4)`
            pool.query(queryInsert, [id, title, genres, year], (error, result) => {
                if(error) {
                    throw error
                } else {
                    res.status(201).json({
                        message: "Data Insert Succesfuly"
                    })
                }
            })
        }
    })
})

route.put('/movies/:id', (req, res) => {
    //jika id tidak ada maka "ID Does not exist"
    //jika id ada maka bisa update/put data
    const {id} = req.params;
    const getIdExist = `SELECT * FROM movies WHERE id = $1`

    pool.query(getIdExist, [id], (error, result) => {
        if(error) {
            throw error
        } else if (result.rows[0] == null){
            res.status(200).json({
                message: "ID Data Does not exist"
            })
        } else {
            const {id, title, genres, year} = req.body
            console.log(req.body);
            const queryInsert = `UPDATE movies 
                                SET title = $2,
                                genres = $3,
                                year = $4
                                WHERE id = $1`
            pool.query(queryInsert, [id, title, genres, year], (error, result) => {
                if(error){
                    throw error
                // mengecek apakah inputan sudah lengkap atau belum jika belum maka keluarkan msg
                } else if ((req.body.id && req.body.title && req.body.genres && req.body.year) == null){
                    res.json({
                        message: "Your Input Invalid, Please Check again"
                    })
                } else{
                    res.status(201).json({
                        message: "Updating Data Succesfuly"
                    })
                }
            })
        }
    })
})

route.delete('/movies/:id', (req, res) => {
    const {id} = req.params;
    const findQuery = `SELECT * FROM movies WHERE id = $1`
    pool.query(findQuery, [id], (error, result) => {
        if(error) {
            throw error
        }
        // mengecek apakah ada data yang akan di cari
        if(result.rows[0]) {
            const deleteQuery = `DELETE FROM movies
            WHERE id = $1`

            pool.query(deleteQuery, [id], (error, result) => {
                if(error) {
                    throw error
                }
                res.status(200).json({
                    message : "Delete Data Succesfuly"
                });
            })
        } else {
            res.status(404).json({
                message : "Data Not Found"
            })
        }
    })
})


module.exports = route;