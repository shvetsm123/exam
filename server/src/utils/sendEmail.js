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

    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log('Email sent successfully');
    console.log('Preview URL: %s', previewUrl);

    return previewUrl;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new ServerError('Error sending email');
  }
}

module.exports = { sendEmail };
