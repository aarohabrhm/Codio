//this is authentication logic broye

import express from 'express'
import jwt from 'jsonwebtoken'
const router=express.Router()
import User from '../models/user.js'
import { register,login } from '../controllers/authcontroller.js'

const generateTokens=(User)=>{
    const accesstoken=jwt.sign(
        {id:User._id,username:user.username},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'}

    )
    const refreshToken = jwt.sign(
        {id:User._id},process.env.JWT_REFRESH_TOKEN_SECRET,
        {expiresIn:'7d'}
    )
    return {
        accesstoken,refreshToken
    }
}

router.post('/register',register)
router.post('/login',login)
export default router