const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const payload = { user: { id: userId } };
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = generateToken;
