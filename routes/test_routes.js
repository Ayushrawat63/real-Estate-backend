const express=require('express');
const { normalUserAuth, adminUserAuth } = require('../controller/test_controller');
const verifyToken = require('../middleware/verifyToken');

const router= express.Router()

router.get('/normalUser',verifyToken, normalUserAuth)
router.get('/adminUser',adminUserAuth)
 
module.exports=router;