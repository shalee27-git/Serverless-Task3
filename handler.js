require("dotenv").config();

const nodemailer = require("nodemailer");

module.exports.sendEmail = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { receiver_email, subject, body_text } = body;
        if (!receiver_email || !subject || !body_text) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing required fields" }),
            };
        }
         const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
         });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: receiver_email,
            subject,
            text: body_text,
         };
         await transporter.sendMail(mailOptions);

         return {
            statusCode: 200,
            body: JSON.stringify({ message: "Email sent successfully" }),
         };
    } catch (error) {
        console.error("Error sending email:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
        };
    }
};