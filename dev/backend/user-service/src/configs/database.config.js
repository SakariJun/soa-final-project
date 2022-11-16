const mongoose = require('mongoose');

function handleDatabaseError(error) {
    console.error(error);
    console.error("Server can't working if can't connect to database!");
    process.exit(1);
}

function connect() {
    try {
        // const MONGODB_URI = process.env.MONGODB_URI_CLUSTER;
        const MONGODB_URI = process.env.MONGODB_URI;

        const options = {
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4, // Use IPv4, skip trying IPv6
            keepAlive: true, // For long running applications
            keepAliveInitialDelay: 300000,
        };

        mongoose.connect(MONGODB_URI, options);

        // Error handling for established connections
        mongoose.connection.on('connected', () => {
            console.error('Mongoose connection connected');
        });

        mongoose.connection.on('error', (error) => {
            console.error('Mongoose connection error: ' + error);
            handleDatabaseError(error);
        });

        mongoose.connection.on('disconnected', () => {
            console.error('Mongoose connection disconnected');
        });
    } catch (error) {
        handleDatabaseError(error);
    }
}

module.exports = connect;
