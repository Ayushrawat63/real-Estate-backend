const express=require('express');
const verifyToken = require('../middleware/verifyToken');
const { getChats, getChat, addChat, readChat } = require('../controller/chat_controller');

const router= express.Router()

router.get('/',verifyToken,getChats)
router.get('/unique/:id',verifyToken,getChat)
router.post('/add',verifyToken,addChat)
router.put('/read/:id',verifyToken,readChat)


 
module.exports=router;