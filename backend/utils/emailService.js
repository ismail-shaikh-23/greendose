/* eslint-disable max-len */
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const commonFunctions = require('./commonFunctions');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use true for port 465
  auth: {
    // user: process.env.EMAIL_USER,
    // pass: process.env.EMAIL_PASSWORD,
    user: 'sahilnikam@nimapinfotech.com',
    pass: 'eimo yhyl ygkg trls',
  },
});

async function getFileSize(filepath) {
  try {
    const stats = await fs.stat(filepath);
    if (!stats.isFile()) {
      throw new Error('Path is not a file');
    }
    return stats.size / (1024 * 1024);
  } catch (error) {
    throw new Error('Failed to get file size', error);
  }
};

function getContentType(filepath) {
  const ext = path.extname(filepath).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.csv': 'text/csv',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

const sendEmail = async(to, subject, html, filepath = null, referenceId) => {
  const recipients = Array.isArray(to) ? to : [to];
  if (!recipients.length || recipients.some(email => !email || !/\S+@\S+\.\S+/.test(email)) || !subject || !html) {
    throw new Error('Valid recipient(s), subject, and HTML content are required');
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'sahilnikam@nimapinfotech.com',
      to: recipients.length === 1 ? recipients[0] : recipients,
      subject,
      html,
    };

    if (filepath) {
      const fileSize = await getFileSize(filepath);
      if (fileSize > 20) {
        throw new Error('File size exceeds 20MB limit');
      }
      mailOptions.attachments = [
        {
          filename: path.basename(filepath),
          path: filepath,
          contentType: getContentType(filepath),
        },
      ];
    }

    await transporter.sendMail(mailOptions);
    return {
      status: 'success',
      message: `Email sent successfully to ${recipients.join(', ')}`,
    };
  } catch (error) {
    const errorInfo = {
      to: recipients.join(', '),
      subject,
      errorMessage: error.message,
      stackTrace: error.stack,
      time: new Date(),
      referenceId,
    };

    try {
      await commonFunctions.create('emailLog', errorInfo, false);
    } catch (logError) {
      console.error('Failed to log email error to DB:', logError.message);
    }
    throw new Error(`Failed to send email to ${recipients.join(', ')}: ${error.message}`);
  }
};

module.exports = sendEmail;