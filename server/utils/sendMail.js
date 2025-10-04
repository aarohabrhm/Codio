import nodemailer from "nodemailer";

export const sendOtpMail = async (to, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });


        const mailOptions = {
            from: `"MyApp Support" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Your OTP Code",
            text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
        };

        const info = await transporter.sendMail(mailOptions);

        // check result
        console.log("Message sent: %s", info.messageId);

        return { success: true, info };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
};
