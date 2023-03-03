const express = require('express');
const app = express();
const port = 3000;
const pool = require('./connectDb.js');
const routeMovies = require('./routes/movies.js');
const routeUsers = require('./routes/users');
const logReg = require('./routes/login-register.js')
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/', routeUsers);
app.use('/', routeMovies);
app.use('/', logReg);


pool.connect((err,res)=>{
    console.log(err);
    console.log('Connect');
})

app.listen(port);