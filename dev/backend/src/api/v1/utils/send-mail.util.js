const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const CLIENT_ID = process.env['SEND_MAIL_API_CLIENT_ID'];
const CLIENT_SECRET = process.env['SEND_MAIL_API_CLIENT_SECRET'];
const REDIRECT_URI = process.env['SEND_MAIL_API_REDIRECT_URI'];
const REFRESH_TOKEN = process.env['SEND_MAIL_API_REFRESH_TOKEN'];
const NODEMAILER_AUTH_USER = process.env['SEND_MAIL_API_NODEMAILER_AUTH_USER'];

let oAuth2Client;
try {
    oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
} catch (err) {
    console.log(err);
    console.log('RefreshToken hết hạn Vui lòng liên hệ chủ sở hữu để nhận RefreshToken mới!');
    process.exit(1);
}

const sendMail = async function (sendToEmail, subjectMain, mailContent) {
    try {
        if (!sendToEmail || !subjectMain || !mailContent) {
            return { status: false, message: "Missing params can't send mail!" };
        }
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: NODEMAILER_AUTH_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: NODEMAILER_AUTH_USER,
            to: sendToEmail,
            subject: subjectMain,
            text: mailContent,
        };

        return new Promise(function (resolve, reject) {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error);
                    reject({ status: false, message: error.message });
                } else {
                    resolve({ status: true, message: info.response });
                }
            });
        });
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

module.exports = { sendMail };
