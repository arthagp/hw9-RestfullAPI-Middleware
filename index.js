const express = require('express');
const app = express();
const port = 3000;
const pool = require('./config.js');
const routeMovies = require('./routes/movies.js');
const routeUsers = require('./routes/users');
const logReg = require('./routes/login-register.js')
const swaggerUi = require('swagger-ui-express');
const swaggerJson = require('./swagger.json')
const morgan = require('morgan');

app.use(morgan('tiny'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/', logReg);

app.use('/', routeUsers);
app.use('/', routeMovies);


pool.connect((err,res)=>{
    if (err) throw err
    console.log('Connect');
})

app.listen(port, () => {
    console.log(`Server Berjalan di port ${port}`);
});