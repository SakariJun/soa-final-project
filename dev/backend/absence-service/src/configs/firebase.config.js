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

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDYIgwlQtRcqhA2NjpMnqIuSq91WAoTZaQ",
//   authDomain: "soa-final-term.firebaseapp.com",
//   projectId: "soa-final-term",
//   storageBucket: "soa-final-term.appspot.com",
//   messagingSenderId: "101798679153",
//   appId: "1:101798679153:web:3e19b0595957c6ff7a81d0",
//   measurementId: "G-SJNTS7J2YE"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyDYIgwlQtRcqhA2NjpMnqIuSq91WAoTZaQ",
//     authDomain: "soa-final-term.firebaseapp.com",
//     projectId: "soa-final-term",
//     storageBucket: "soa-final-term.appspot.com",
//     messagingSenderId: "101798679153",
//     appId: "1:101798679153:web:3e19b0595957c6ff7a81d0",
//     measurementId: "G-SJNTS7J2YE"
//   };
