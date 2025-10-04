import nodemailer from "nodemailer";

export const sendOtpMail = async (to, otp) => {
    try {
        // transporter (example: Gmail with app password)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,   // your email
                pass: process.env.EMAIL_PASS,   // your app password
            },
        });

        // mail options
        const mailOptions = {
            from: `"MyApp Support" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Your OTP Code",
            text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
        };

        // send email
        const info = await transporter.sendMail(mailOptions);

        // check result
        console.log("Message sent: %s", info.messageId);

        // if it has a messageId, it was accepted by SMTP
        return { success: true, info };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
};
