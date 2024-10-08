const express=require('express')
const { getPosts, getPost, addPost, updatePost, deletePost, deleteAllPost} = require('../controller/post_controller')
const verifyToken = require('../middleware/verifyToken')


const router= express.Router()

router.get('/',getPosts)
router.get('/:id',getPost)
router.post('/add',verifyToken, addPost)
router.put('/:id',verifyToken,updatePost)
router.delete('/:id',verifyToken,deletePost)
router.delete('/',verifyToken,deleteAllPost)

module.exports=router;