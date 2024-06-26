const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../modals/User');

//protect routes
exports.protect = asyncHandler (async(req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        //set token from bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.token){
        //set token from cookie
        token = req.cookies.token;
    };

    //make sure token exists
    if(!token){
        return next(new ErrorResponse('Not authoirzed to access this route', 401));
    }

    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        return next(new ErrorResponse('Not authoirzed to access this route', 401));
    }
});

//grant access to specific roles
exports.authorize = (...roles) => {
    return (req,res,next) =>{
        console.log(req.user);
        if(!roles.includes(req.user.role)){
        return next(new ErrorResponse(`User ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    }
}