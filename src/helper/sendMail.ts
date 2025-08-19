import { config } from 'dotenv';
import { MailInfoProps } from '../Types/MailInfo.props';
const nodemailer = require('nodemailer');

const sendMail = async (to: string, subject: string, html: string) => {
    config(); // Load environment variables from .env file
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'Gmail',
        auth: {
            user: process.env.USER_MAIL, // Use environment variable for email
            pass: process.env.USER_PASSWORD, // Use environment variable for password
        },
    });

    const mailOptions = {
        from: 'ADMIN CUA SUC KHOE HOAN HAO', 
        to,
        subject,
        html,
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
export default sendMail;