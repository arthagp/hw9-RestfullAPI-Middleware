const express = require("express");
const route = express.Router();
const pool = require("../config.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//membuat enpoint untuk login

//ketika menginputkan password user akan di di enkripsi menggunakan bycript
// menggunakan async await untuk menunggu proses hash pada password, sehingga data tidak bernilai undefined ketika tidak menggunakan async await
route.post("/register", async (req, res) => {
  console.log(req.body);
  const { id, email, gender, password, role } = req.body;

  //membuat password menjadi enkrip

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashPass = await bcrypt.hash(password, salt);

  const queryRegister = `INSERT INTO users(id, email, gender, password, role)
                            VALUES ($1, $2, $3, $4, $5);`;
  const data = [id, email, gender, hashPass, role];

  //notes : masukan role = user/admin

  // parameter dari method query(query, values(any), callback)
  pool.query(queryRegister, data, (error, result) => {
    if (error) {
      throw error;
    }
    res.status(201).json({
      message: "Succes",
    });
  });
});


route.post("/login", (req, res, next) => {
    // console.log(req.body);
    const { email, password} = req.body;
    const findQuery = `SELECT * FROM users WHERE email = $1`;
  
    pool.query(findQuery, [email], async (error, result) => {
      if (error) {
        throw error;
      } else if (!result.rows[0]) { // tambahkan pengecekan jika user tidak ditemukan
        res.status(200).json({
          message: "Please Check Your email",
        });
      } else {
        //compare inputan passwd dengan yang ada di database yang sdh di bycrypt
        const compare = await bcrypt.compare(password, result.rows[0].password);
        const role = result.rows[0].role;
        if (compare) {
          const tokenUser = jwt.sign(
            {
              email: email,  
              role: role
            },
            "secretkey"
          );
          res.status(200).json({
            message: "Berhasil Masuk",
            role: role,
            token: tokenUser,
          });
          console.log('Login Succes');
        } else {
          res.status(200).json({
            message: "Wrong Password", // tambahkan pesan jika password salah
          });
        }
      }
    });
  });


  

module.exports = route;
