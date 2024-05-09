const Data = require('../modals/Data');
const ErrorResponse = require ('../utils/errorResponse');
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder');
const colors = require('colors');

//@desc  Get All Data
//@route GET  /api/v1/data
//@access Public 

exports.getData = asyncHandler(async (req,res, next) => {
    let query;

    //copy req.query
    const reqQuery = {...req.query};

    //fields to exclude (so they dont match)
    const removeFields = ['select', 'sort'];
    //loop over removeFields and delete them from reqQuery

    removeFields.forEach(param => delete reqQuery[param]);

    //create query string
    let queryStr = JSON.stringify(reqQuery);

    //create operators
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //finding resource
    query = Data.find(JSON.parse(queryStr))
    
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

    //executing query
    const data = await query;

    res.status(200).json({success: true,
        count: data.length,
        data: data});
});

//@desc  Get Single Data
//@route GET  /api/v1/data/:id
//@access Public 

exports.getSingleData = asyncHandler( async (req, res, next) => {
        const singleData = await Data.findById(req.params.id);

        if (!singleData) {
            return next(
                new ErrorResponse(`Data not found with id of ${req.params.id}`,
                404)
            );
        };
        res.status(200).json({ success: true, data: singleData });
        
});

//@desc  Create Data
//@route POST  /api/v1/data
//@access Private 

exports.createData = asyncHandler( async (req,res, next) => {
        const data = await Data.create(req.body);
        console.log(req.body)
        res.status(201).json({
            success: true,
            data: data
        });

});

//@desc  Update Data
//@route PUT  /api/v1/data/:id
//@access Private 

exports.updateData = asyncHandler( async (req,res, next) => {
        const singleData = await Data.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true 
        });
    
        if (!singleData){
            return next(
                new ErrorResponse(`Data not found with id of ${req.params.id}`,
                404)
            );
        };

        res.status(200).json({success: true, data: singleData});
});

//@desc  Delete Data
//@route DELETE  /api/v1/data/:id
//@access Private 

exports.deleteData = asyncHandler( async (req,res, next) => {
        const singleData = await Data.findByIdAndDelete(req.params.id);
    
        if (!singleData){
            return next(
                new ErrorResponse(`Data not found with id of ${req.params.id}`,
                404)
            );
        };

        res.status(200).json({success: true, data: {}});
});

//@desc  Get Data within a radius
//@route GET  /api/v1/data/radius/:zipcode/:distance
//@access Private 

exports.getDataInRadius = asyncHandler( async (req,res, next) => {
    const { zipcode, distance } = req.params;

    //Get latitude and longitud from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //calcular radius using radians
    //divide distance by radius of earth
    //Earth Radius = 3,963 miles = 6,378 km
    const radius = distance / 3963;

    const data = await Data.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: data.length,
        data: data
    });
});


