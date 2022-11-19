const crypto = require('crypto');

const algorithm = "aes-256-cbc";

// const cipher = crypto.createCipheriv(algorithm, 'bf3c199c2470cb477d907b1e0917c17b', '5183666c72eec9e4');
// const decipher = crypto.createDecipheriv(algorithm, 'bf3c199c2470cb477d907b1e0917c17b', '5183666c72eec9e4');

function encryptMessage(plainMessage) {


    try {
        const cipher = crypto.createCipheriv(algorithm, process.env.SECRET_ENC_KEY, process.env.SECRET_INV);

        let encryptedData = cipher.update(plainMessage, "utf-8", "hex");

        encryptedData += cipher.final("hex");

        return { status: true, encryptedData }
    } catch (err) {
        return { status: false, error: err.message }
    }
}

function decryptMessage(encryptedMessage) {
    // the decipher function
    try {
        const decipher = crypto.createDecipheriv(algorithm, process.env.SECRET_ENC_KEY, process.env.SECRET_INV);

        let decryptedData = decipher.update(encryptedMessage, "hex", "utf-8");

        decryptedData += decipher.final("utf8");

        return { status: true, decryptedData }
    } catch (err) {
        return { status: false, error: err.message }
    }
}

module.exports = {
    encryptMessage,
    decryptMessage,
}