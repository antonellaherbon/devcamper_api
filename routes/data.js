const express = require('express')
const router = express.Router();

const { getData, 
    getSingleData, 
    createData, 
    updateData, 
    deleteData,
    getDataInRadius} = require('../controllers/data');

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
