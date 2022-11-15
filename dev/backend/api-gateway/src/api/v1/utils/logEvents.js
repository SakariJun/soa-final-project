const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const logFileName = path.join(__dirname, '../logs', 'error.log');

const logEvents = function ({ message = 'None', requestURL = '/', requestMethod = 'GET' }) {
    try {
        const logID = uuid();
        const logDateTime = `${format(new Date(), 'dd-MM-yyyy\tHH:mm:ss')}`;
        const logContent =
            `LOG_ERROR_ID: ${logID}\n` +
            `TIME: ${logDateTime}\n` +
            `URL: ${requestURL}\n` +
            `METHOD: ${requestMethod}\n` +
            `MESSAGE: ${message}\n` +
            `--------------------------------------------------------\n`;
            
        fs.appendFile(logFileName, logContent);
    } catch (error) {
        console.error(__dirname + 'Error: ' + error.message);
    }
};

module.exports = logEvents;
