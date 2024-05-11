const Bootcamp = require('../modals/Bootcamp');
const ErrorResponse = require ('../utils/errorResponse');
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder');
const colors = require('colors');

//@desc  Get All bootcamps
//@route GET  /api/v1/bootcamps
//@access Public 

exports.getBootcamps = asyncHandler(async (req,res, next) => {
    let query;

    //copy req.query
    const reqQuery = {...req.query};

    //fields to exclude (so they dont match)
    const removeFields = ['select', 'sort', 'limit', 'page'];

    //loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    //create query string
    let queryStr = JSON.stringify(reqQuery);

    //create operators
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //finding resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');
    
    //Select fields
    if (req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else{
        query = query.sort('-createdAt');
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page-1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //executing query
    const bootcamp = await query;

    //Pagination result
    const pagination = {};
    if(endIndex < total){
        pagination.next = {
            page: page +1,
            limit
        }
    }

    if (startIndex > 0){
        pagination.prev = {
            page: page -1,
            limit
        }
    }

    res.status(200).json({success: true,
        count: bootcamp.length,
        pagination,
        data: bootcamp});
});

//@desc  Get Single bootcamp
//@route GET  /api/v1/bootcamps/:id
//@access Public 

exports.getBootcamp = asyncHandler( async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return next(
                new ErrorResponse(`bootcamp not found with id of ${req.params.id}`,
                404)
            );
        };
        res.status(200).json({ success: true, data: bootcamp });
        
});

//@desc  Create bootcamps
//@route POST  /api/v1/datbootcampsa
//@access Private 

exports.createBootcamp = asyncHandler( async (req,res, next) => {
        const bootcamp = await Bootcamp.create(req.body);
        console.log(req.body)
        res.status(201).json({
            success: true,
            data: bootcamp
        });

});

//@desc  Update bootcamp
//@route PUT  /api/v1/bootcamps/:id
//@access Private 

exports.updateBootcamp = asyncHandler( async (req,res, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true 
        });
    
        if (!bootcamp){
            return next(
                new ErrorResponse(`bootcamp not found with id of ${req.params.id}`,
                404)
            );
        };

        res.status(200).json({success: true, data: bootcamp});
});

//@desc  Delete bootcamp
//@route DELETE  /api/v1/bootcamps/:id
//@access Private 

exports.deleteBootcamp = asyncHandler( async (req,res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp){
            return next(
                new ErrorResponse(`bootcamp not found with id of ${req.params.id}`,
                404)
            );
        };

        await bootcamp.deleteOne();

        res.status(200).json({success: true, data: {}});
});

//@desc  Get bootcamps within a radius
//@route GET  /api/v1/bootcamps/radius/:zipcode/:distance
//@access Private 

exports.getBootcampInRadius = asyncHandler( async (req,res, next) => {
    const { zipcode, distance } = req.params;

    //Get latitude and longitud from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //calcular radius using radians
    //divide distance by radius of earth
    //Earth Radius = 3,963 miles = 6,378 km
    const radius = distance / 3963;

    const bootcamp = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamp.length,
        data: bootcamp
    });
});

