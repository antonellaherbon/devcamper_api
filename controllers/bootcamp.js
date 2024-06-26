const path = require('path');
const Bootcamp = require('../modals/Bootcamp');
const ErrorResponse = require ('../utils/errorResponse');
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder');


//@desc  Get All bootcamps
//@route GET  /api/v1/bootcamps
//@access Public 

exports.getBootcamps = asyncHandler(async (req,res, next) => {
    res.status(200).json(res.advancedResults);
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
    //add user to req.body
    req.body.user = req.user.id;
    
    //check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    //if the user is not an admin, they can only add one bootcamp
    if(publishedBootcamp && req.user.role != 'admin'){
        return next(new ErrorResponse(`The user with id ${req.user.id} has already published a bootcamp`, 400));
    }

    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp
    });

});

//@desc  Update bootcamp
//@route PUT  /api/v1/bootcamps/:id
//@access Private 

exports.updateBootcamp = asyncHandler( async (req,res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
    
        if (!bootcamp){
            return next(
                new ErrorResponse(`bootcamp not found with id of ${req.params.id}`,
                404)
            );
        };

        //make sure user is bootcamp owner
        if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return next(
                new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`,
                401)
            );
        };

        bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

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

        //make sure user is bootcamp owner
        if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return next(
                new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`,
                401)
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


//@desc  Upload Photo for bootcamp
//@route PUT  /api/v1/bootcamps/:id/photo
//@access Private 

exports.bootcampPhotoUpload = asyncHandler( async (req,res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp){
        return next(
            new ErrorResponse(`bootcamp not found with id of ${req.params.id}`,
            404)
        );
    };

    //make sure user is bootcamp owner
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`,
            401)
        );
    };

    if(!req.files){
        return next(new ErrorResponse('Pleade upload a file', 400))
    };
    
    const file = req.files.file;

    //make sure its a photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('Pleade upload an image file', 400))
    };

    //check file size
    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Pleade upload an image file less than ${process.env.MAX_FILE_UPLOAD}`, 400))
    };

    //create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err);
        return next(new ErrorResponse('Problem with file upload', 500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        });
    })
   
});
