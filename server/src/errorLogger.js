const fs = require('fs');
const path = require('path');
const moment = require('moment');
const CronJob = require('cron').CronJob;

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

function copyAndProcessErrorLog() {
  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${logFilePath}: ${err.message}`);
      return;
    }

    const destinationFileName = path.join(
      __dirname,
      `errors_${moment().format('YYYY-MM-DD_HH-mm-ss')}.log`
    );

    const processedData = data
      .split('\n')
      .map((line) => {
        try {
          const entry = JSON.parse(line);
          delete entry.stackTrace;
          return JSON.stringify(entry);
        } catch (err) {
          console.log(err);
        }
      })
      .filter(Boolean)
      .join('\n');

    fs.writeFile(destinationFileName, processedData, (err) => {
      if (err) {
        console.error(
          `Error writing to file ${destinationFileName}: ${err.message}`
        );
      } else {
        console.log(
          `File ${destinationFileName} successfully created and written.`
        );

        fs.writeFile(logFilePath, '', (err) => {
          if (err) {
            console.error(`Error clearing file ${logFilePath}: ${err.message}`);
          } else {
            console.log(`File ${logFilePath} successfully cleared.`);
          }
        });
      }
    });
  });
}

const dailyJob = new CronJob('0 0 * * *', copyAndProcessErrorLog);
dailyJob.start();

module.exports = {
  logError,
  copyAndProcessErrorLog,
};
