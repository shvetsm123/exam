const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'errors.log');

function logError(error) {
  const logEntry = {
    message: error.message || 'Unknown error',
    time: new Date().toISOString(),
    code: error.code,
    stackTrace: error.stack || 'No stack trace available',
  };

  const logString = JSON.stringify(logEntry) + '\n';

  fs.appendFile(logFilePath, logString, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}

module.exports = {
  logError,
};
