const fs = require('fs');
const pool = require('../connectDb.js')

const pathSeed = './seeding.sql'

fs.readFile(pathSeed, 'utf-8', (err, data) => {
    if(err){
        console.log(err)
    } else {
        console.log(data);
        pool.query(data, (error, result) => {
            if (error){
                console.log(error);
            } else {
                console.log(result);
                console.log('Seeding Completed!!')
            }
            pool.end();
        })
    }
})