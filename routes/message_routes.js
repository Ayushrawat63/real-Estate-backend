const express=require('express');
const { addmessage } = require('../controller/message_controller');
const verifyToken = require('../middleware/verifyToken');


const router= express.Router()

router.post('/add/:id',verifyToken,addmessage)

 
module.exports=router;