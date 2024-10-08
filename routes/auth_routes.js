const express=require('express')
const {registerNewUser,loginUser,logoutUser}=require('../controller/auth_controller')
const router= express.Router()

router.post('/register',registerNewUser)

router.post('/login',loginUser)

router.post('/logout',logoutUser)

module.exports=router;