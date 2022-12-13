const admin = require('firebase-admin');

const serviceAccount = require('./soa-final-term-firebase-adminsdk-cqk64-53f73564f2.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://soa-final-term.appspot.com',
});

const bucket = admin.storage().bucket();

module.exports = {
    bucket,
};
