const Course = require('../modals/Course');
const ErrorResponse = require ('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


//@desc  Get All Courses
//@route GET  /api/v1/courses
//@route GET  /api/v1/:dataId/courses
//@access Public 

exports.getCourses = asyncHandler (async (req, res, next) => {
    let query;

    if (req.params.dataId){
        query = Course.find({ bootcamp: req.params.dataId })
    }else{
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
})

