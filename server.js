const express = require('express');
const dotenv = require('dotenv');
const data = require('./routes/data');
const logger = require('./middleware/logger');
const morgan = require('morgan');

//load config file
dotenv.config({path: './config/config.env'});
const app = express();

// dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use('/api/v1/data', data);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    console.log(`server running on port ${process.env.NODE_ENV} mode on port ${PORT}`)
);

