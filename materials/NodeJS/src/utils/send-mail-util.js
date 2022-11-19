const nodemailer = require('nodemailer');
const { NODEMAILER_HOST, NODEMAILER_PORT, NODEMAILER_AUTH_USER, NODEMAILER_AUTH_PASS } = process.env;

const transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: NODEMAILER_HOST,
    port: NODEMAILER_PORT,
    secure: false,
    ignoreTLS : true,
    auth: {
        user: NODEMAILER_AUTH_USER,
        pass: NODEMAILER_AUTH_PASS,
    }
});

function sendMail(sendToEmail, subjectMain, mailContent) {
    return new Promise(function(resolve, reject) {
        const mailOptions = {
            from: NODEMAILER_AUTH_USER,
            to: sendToEmail,
            subject: subjectMain,
            text: mailContent
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
                reject({ status: false, message: error.message });
            } else {
                resolve({ status: true, message: info.message });
            }
        });
    })
}

module.exports = { sendMail }