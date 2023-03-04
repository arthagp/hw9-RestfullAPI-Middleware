const express = require("express");
const route = express.Router();
const pool = require("../config");
const jwt = require("jsonwebtoken");

//PAGINATE
route.get("/users", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
  
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    const results = {};
  
    //menghitung total data yang tersedia di database
    try {
      const countResult = await pool.query("SELECT COUNT(*) FROM users");
      const count = countResult.rows[0].count;
      results.totalCount = count;
  
      //mengambil data film dari database dengan teknik pagination
      const result = await pool.query(
        `SELECT * FROM users ORDER BY id OFFSET ${startIndex} LIMIT ${limit}`
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

// GET, POST, DELETE, PUT in users table

route.get('/users', (req, res) => {
    const query = `SELECT * FROM users`;

    pool.query(query, (error, result) => {
        if(error) throw error
        res.status(200).json(result.rows);
    })
})

//DISINI SAYA TIDAK PAKAI POST(CREATE USER), karena sudah ada di (login-register.js) yaitu pada register

route.put("/users/:id", (req, res) => {
    //jika id tidak ada maka "ID Does not exist"
    //jika id ada maka bisa update/put data
    const { id } = req.params;
    const getIdExist = `SELECT * FROM users WHERE id = $1`;
  
    pool.query(getIdExist, [id], (error, result) => {
      if (error) {
        throw error;
      } else if (result.rows[0] == null) {
        res.status(200).json({
          message: "ID Data Does not exist",
        });
      } else {
        const { id, title, genres, year } = req.body;
        console.log(req.body);
        // di sini untuk update hanya dapat mengubah email, dan gender
        const queryInsert = `UPDATE users 
                                  SET email = $2,
                                  gender = $3,
                                  WHERE id = $1`;
        pool.query(queryInsert, [id, email, gender], (error, result) => {
          if (error) {
            throw error;
            // mengecek apakah inputan sudah lengkap atau belum jika belum maka keluarkan msg
          } else if (
            (req.body.id && req.body.email && req.body.gender) ==
            null
          ) {
            res.json({
              message: "Your Input Invalid, Please Check again",
            });
          } else {
            res.status(201).json({
              message: "Updating Data Succesfuly",
            });
          }
        });
      }
    });
  });

  //UNTUK VERIFIY USER
const verifyUser = (req, res, next) => {
    const { bearer } = req.headers;
    jwt.verify(bearer, "secretkey", (error, result) => {
      if (error) {
        throw error;
      } else if (req.body = result.role == 'admin') {
        req.body = result;
        console.log(req.body);
        next();
      } else {
          console.log('Kamu Bukan Admin')
      }
    });
  };
  
  route.delete("/users/:id", verifyUser, (req, res) => {
    const { id } = req.params;
    const findQuery = `SELECT * FROM users WHERE id = $1`;
  
    pool.query(findQuery, [id], (error, result) => {
      if (error) {
        throw error;
      }
      // mengecek apakah ada data yang akan di cari
      if (result.rows[0]) {
        const deleteQuery = `DELETE FROM users
            WHERE id = $1`;
  
        pool.query(deleteQuery, [id], (error, result) => {
          if (error) {
            throw error;
          }
          res.status(200).json({
            message: "Delete Data Succesfuly",
          });
        });
      } else {
        res.status(404).json({
          message: "Data Not Found",
        });
      }
    });
  });


module.exports = route;