/* eslint-disable max-len */
const crypto = require('crypto');
const { ENCRYPTION_SECRET } = require('./constant');

const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_SECRET || ENCRYPTION_SECRET;
const iv = crypto.randomBytes(16);

exports.encrypt = (payload) => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(payload);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

exports.decrypt = (payload) => {
  const textParts = payload.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
