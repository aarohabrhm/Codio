import nodemailer from 'nodemailer'
export const sendOtp =async (email,otp)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    })
    const mailOptions = {
        from:`"CodeSync"<${process.env.EMAIL_USER}>`,
        to:email,
        subject:"This is a OTP Verification Code for SigningUp in CodeSync",
        text:`Your OTP is ${otp}. it will expires in 5 minutes.`,
    }
    await transporter.sendMail(mailOptions)
}