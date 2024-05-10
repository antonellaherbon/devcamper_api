const express = require('express')

const { getData, 
    getSingleData, 
    createData, 
    updateData, 
    deleteData,
    getDataInRadius} = require('../controllers/data');
    
    //Include other resource routers
const courseRouter = require('./courses');
    
const router = express.Router();
//Re-route into other resource routers
router.use('/:dataId/courses', courseRouter);

router.route('/radius/:zipcode/:distance')
.get(getDataInRadius);


router.route('/')
.get(getData)
.post(createData);

router.route('/:id')
.get(getSingleData)
.put(updateData)
.delete(deleteData);

module.exports =router;
