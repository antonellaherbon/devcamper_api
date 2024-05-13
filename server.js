const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});
const morgan = require('morgan');
const dbConnecttion = require('./config/db');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const bootcamp = require('./routes/bootcamp');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const cookieParser = require('cookie-parser');



//load config file
dbConnecttion();

const app = express();

app.use(express.json());

//cookie parser
app.use(cookieParser());

// dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};

//file upload
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps', bootcamp);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    console.log(`server running on port ${process.env.NODE_ENV} mode on port ${PORT}`)
);
