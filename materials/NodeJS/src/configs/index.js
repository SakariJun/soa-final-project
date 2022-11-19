const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

module.exports = (app) => {
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, '..', '..', 'public', 'uploads')));
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }));

    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
            standardHeaders: true,
            legacyHeaders: false,
        })
    );
}