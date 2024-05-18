const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//load env vars
dotenv.config({path: './config/config.env'});

const geocoder = require('./utils/geocoder');
//load models
const Bootcamp = require('./modals/Bootcamp');
const Course = require('./modals/Course');
const User = require('./modals/User');
const Review = require('./modals/Review');

const colors = require('colors')
//connect to db
mongoose.connect(process.env.MONGODB);

//read Json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'));


//import into db
const importData = async () => {
    try {
        console.log('Data initializing...'.green.inverse);
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        await Review.create(reviews);


        console.log('Data imported...'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

//delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();

        console.log("Data destroyed...".red.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

if(process.argv[2] === '-i'){
    importData();
}else if (process.argv[2] === '-d'){
    deleteData();
}

