const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

async function sendEmail(to, subject, html) {
  const test = {
    user: 'sebastian.hessel12@ethereal.email',
    pass: 'gHjTS7PAuVZJGeCDm2',
    smtp: {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
    },
  };

  const transporter = nodemailer.createTransport({
    host: test.smtp.host,
    port: test.smtp.port,
    secure: test.smtp.secure,
    auth: {
      user: test.user,
      pass: test.pass,
    },
  });

  const mailOptions = {
    from: test.user,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    const logFilePath = path.join(__dirname, 'email_logs.txt');
    const logEntry = `To: ${to}, Subject: ${subject}, Preview URL: ${nodemailer.getTestMessageUrl(
      info
    )}\n`;

    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      } else {
        console.log('Log entry saved successfully');
      }
    });

    console.log('Email sent successfully');
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    return nodemailer.getTestMessageUrl(info);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new ServerError('Error sending email');
  }
}

module.exports = { sendEmail };
