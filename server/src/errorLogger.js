const fs = require('fs').promises;
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

  return fs.appendFile(logFilePath, logString).catch((err) => {
    console.error('Error writing to log file:', err);
  });
}

function readLogFile() {
  return fs.readFile(logFilePath, 'utf8').catch((err) => {
    console.error(`Error reading file ${logFilePath}: ${err.message}`);
    throw err;
  });
}

function processLogData(data) {
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

  return fs
    .writeFile(destinationFileName, processedData)
    .then(() => {
      console.log(
        `File ${destinationFileName} successfully created and written.`
      );

      return fs.writeFile(logFilePath, '');
    })
    .then(() => {
      console.log(`File ${logFilePath} successfully cleared.`);
    })
    .catch((err) => {
      console.error(`Error writing/clearing files: ${err.message}`);
      throw err;
    });
}

function copyAndProcessErrorLog() {
  readLogFile()
    .then(processLogData)
    .catch((err) => {
      console.error('Error copying and processing error log:', err);
    });
}

const dailyJob = new CronJob('0 0 * * *', copyAndProcessErrorLog);
dailyJob.start();

module.exports = {
  logError,
  copyAndProcessErrorLog,
};
