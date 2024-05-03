const express = require('express')
const router = express.Router();

router.get('/', (req,res) => {
    res
    .status(200)
    .json({success: true, msg: 'show all data'});
});

router.get('/:id', (req,res) => {
    res
    .status(200)
    .json({success: true, msg: `show ${req.params.id}`});
});

router.delete('/:id', (req,res) => {
    res
    .status(200)
    .json({success: true, msg: `delete ${req.params.id}`});
});

router.post('/', (req,res) => {
    res
    .status(200)
    .json({success: true, msg: 'create new'});
});

router.put('/:id', (req,res) => {
    res
    .status(200)
    .json({success: true, msg: `update ${req.params.id}`});
});

module.exports =router;