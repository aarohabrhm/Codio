// this is token logic broye

import jwt from 'jsonwebtoken'
const createAccessToken=(payload)=>{
    return jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{expiresIn:'15m'})
}
const createRefreshToken=(payload)=>{
    return jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn:'7d'})
}
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}
module.exports={createAccessToken,createRefreshToken,verifyAccessToken,verifyRefreshToken}