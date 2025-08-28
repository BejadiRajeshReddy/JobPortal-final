// src/services/EmailServiceDao.ts
//import nodemailer from 'nodemailer';

class EmailServiceDao {
    constructor() {
    }
    async sendOtpEmail(to: string, otp: string) {
       /* const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject: 'Your OTP Verification Code',
            text: `Your OTP code is: ${otp}`,
        });*/
    }
}

export default EmailServiceDao;
