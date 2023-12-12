const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

async function loggerMiddleware(req, res, next) {
    const requestStartTime = Date.now(); // Capture the current timestamp when the request begins
    const timestamp = new Date().toISOString();
    const method = req.method;
    const status = req.statusCode;
    const url = req.url;

    // Simulate an asynchronous operation and write to file
    try {
        res.on('finish', () => {
            const requestEndTime = Date.now(); // Capture the timestamp when the request processing ends
            const duration = requestEndTime - requestStartTime; // Calculate the duration in milliseconds
            const status = res.statusCode; // Capture the response status code

            if(status < 400){
                logEvents(`${method} ${url} - ${status} - ${duration}ms`, 'accessLog.log');
                console.log(`[${timestamp}] ${method} ${url} - ${status} - ${duration}ms`);
            } else{
                logEvents(`${method} ${url} - ${status} - ${duration}ms`, 'ErrorLog.log');
                console.log(`[${timestamp}] ${method} ${url} - ${status} - ${duration}ms`);
            }
        });
    } catch (error) {
        console.error('Error while logging:', error);
    }

    // Call next middleware in the chain
    next();
}

const logEvents = async (sms, logFileName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${sms}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem);
    } catch (err) {
        console.log(err);
    }
};

module.exports = loggerMiddleware;
