const Course = require('../modals/Course');
const ErrorResponse = require ('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Data = require('../modals/Data');


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
});


//@desc  Get Single Course
//@route GET  /api/v1/courses/:id
//@access Public 

exports.getSingleCourse = asyncHandler (async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!course){
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 
        404)
    }

    res.status(200).json({
        success: true,
        data: course
    })
});

//@desc  Add a course
//@route POST  /api/v1/data/:dataId/courses
//@access Private 

exports.addCourse = asyncHandler (async (req, res, next) => {
    req.body.bootcamp = req.params.dataId;
    
    const data = await Data.findById(req.params.dataId);

    if (!data){
        return next(new ErrorResponse(`No course with the id of ${req.params.dataId}`), 
        404)
    };

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course
    });
})




