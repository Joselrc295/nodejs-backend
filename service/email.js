const nodemailer = require('nodemailer');
const config = require('../settings/config');

const sendEmail = async options => {
    let transporter = nodemailer.createTransport({
        host: config.EMAIL_HOST,
        port: config.EMAIL_PORT,
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    const mailOptions = {
        from: '<test mail> no-reply',       
        to: options.email,
        subject: options.subject,
        text: options.message
    }

   return  await transporter.sendMail(mailOptions)

}

module.exports = sendEmail;