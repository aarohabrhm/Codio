import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshTokens: [{ token: String, createdAt: Date }]
    isVerified: { type: Boolean, default: false },
    otp:{ type: String, required: true },
    otpExpires: { type: Date },
}, { timestamps: true })

// hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// compare passwords
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

// ✅ ESM export, not CommonJS
export default mongoose.model('User', userSchema)
