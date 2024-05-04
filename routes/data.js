const express = require('express')
const router = express.Router();

const { getData, 
    getSingleData, 
    createData, 
    updateData, 
    deleteData} = require('../controllers/data');

router.route('/')
.get(getData)
.post(createData);

router.route('/:id')
.get(getSingleData)
.put(updateData)
.delete(deleteData);



module.exports =router;
