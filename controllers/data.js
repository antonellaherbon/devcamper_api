//@desc  Get All Data
//@route GET  /api/v1/data
//@access Public 

exports.getData = (req,res, next) => {

    res
    .status(200)
    .json({success: true, msg: 'show all data'});
};

//@desc  Get Single Data
//@route GET  /api/v1/data/:id
//@access Public 

exports.getSingleData = (req,res, next) => {
    res
    .status(200)
    .json({success: true, msg: `show ${req.params.id}`});
};

//@desc  Create Data
//@route POST  /api/v1/data
//@access Private 

exports.createData = (req,res, next) => {
    res
    .status(200)
    .json({success: true, msg: 'create new'});
};

//@desc  Update Data
//@route PUT  /api/v1/data/:id
//@access Private 

exports.updateData = (req,res, next) => {
    res
    .status(200)
    .json({success: true, msg: `update ${req.params.id}`});
};

//@desc  Delete Data
//@route DELETE  /api/v1/data/:id
//@access Private 

exports.deleteData = (req,res, next) => {
    res
    .status(200)
    .json({success: true, msg: `delete ${req.params.id}`});
};




