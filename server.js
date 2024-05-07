const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});
const morgan = require('morgan');
const data = require('./routes/data');
const dbConnecttion = require('./config/db');
const errorHandler = require('./middleware/error');


//load config file
dbConnecttion();

const app = express();

app.use(express.json());

// dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use('/api/v1/data', data);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    console.log(`server running on port ${process.env.NODE_ENV} mode on port ${PORT}`)
);
