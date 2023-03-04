const {Pool} = require('pg');

const pool = new Pool({
    user : 'postgres',
    host : 'localhost',
    database : 'db-movies',
    password : 'arthagp',
    port : 5432,
})

module.exports = pool;