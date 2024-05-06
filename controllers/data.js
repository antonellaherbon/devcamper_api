const Data = require('../modals/Data');
const ErrorResponse = require ('../utils/errorResponse');
const asyncHandler = require('../middleware/async')
//@desc  Get All Data
//@route GET  /api/v1/data
//@access Public 

exports.getData = asyncHandler(async (req,res, next) => {

        const data = await Data.find();
        res.status(200).json({success: true,count: data.length, data: data});
        
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




