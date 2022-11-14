require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http').Server(app);

const configs = require('./configs/app.config');
const databaseConfig = require('./configs/database.config');
const routes = require('./api/v1/routes');

const logEvents = require('./api/v1/utils/logEvents');
const createError = require('http-errors');

databaseConfig();
configs(app);

routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404, 'Not Found !'));
});

// error handler
app.use(function (err, req, res, next) {
    logEvents({ message: err.message, requestURL: req.url, requestMethod: req.method });

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({ status: err.status || 500, message: err.message });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
