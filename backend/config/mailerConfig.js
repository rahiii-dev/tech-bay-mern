import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth : {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASSWORD
    }
})

export default transporter