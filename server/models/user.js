//this is the User Schema broye!

import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    fullname:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    refreshTokens:[{token:String,createdAt: Date}]
},{timestamps:true})
userSchema.pre('save',async function (next) {
    if(!this.isModified('password')) return next()
    try{
            const salt =await bcrypt.genSalt(10);
            this.password=await bcrypt.hash(this.password,salt)
            next()
    }
    catch(err){
        next(err)
    }
})
userSchema.methods.comparePassword=function(enteredPasssword){
    return bcrypt.compare(enteredPasssword,this.password)
}
module.exports=mongoose.model('User',userSchema)