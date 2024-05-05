const Data = require('../modals/Data');
const ErrorResponse = require ('../utils/errorResponse');
//@desc  Get All Data
//@route GET  /api/v1/data
//@access Public 

exports.getData = async (req,res, next) => {
    try {
        const data = await Data.find();
        res.status(200).json({success: true,count: data.length, data: data});
    } catch (error) {
        next(error);
    }
};

//@desc  Get Single Data
//@route GET  /api/v1/data/:id
//@access Public 

exports.getSingleData = async (req, res, next) => {
    try {
        const singleData = await Data.findById(req.params.id);

        if (!singleData) {
            return next(
                new ErrorResponse(`Data not found with id of ${req.params.id}`,
                404)
            );
        }
        res.status(200).json({ success: true, data: singleData });
    } catch (error) {
        next(error);
    }
};

//@desc  Create Data
//@route POST  /api/v1/data
//@access Private 

exports.createData = async (req,res, next) => {
    try {
        const data = await Data.create(req.body);
        console.log(req.body)
        res.status(201).json({
            success: true,
            data: data
        });
    } catch (error) {
        next(error);
    }
};

//@desc  Update Data
//@route PUT  /api/v1/data/:id
//@access Private 

exports.updateData = async (req,res, next) => {
    try {
        const singleData = await Data.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true 
        });
    
        if (!singleData){
            return next(
                new ErrorResponse(`Data not found with id of ${req.params.id}`,
                404)
            );
        }
        res.status(200).json({success: true, data: singleData});
    } catch (error) {
        next(error);
    }
};

//@desc  Delete Data
//@route DELETE  /api/v1/data/:id
//@access Private 

exports.deleteData = async (req,res, next) => {
    try {
        const singleData = await Data.findByIdAndDelete(req.params.id);
    
        if (!singleData){
            return next(
                new ErrorResponse(`Data not found with id of ${req.params.id}`,
                404)
            );
        }
        res.status(200).json({success: true, data: {}});
    } catch (error) {
        next(error);
    }
};




