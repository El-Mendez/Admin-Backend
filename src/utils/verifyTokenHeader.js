const jwt = require('jsonwebtoken');

module.exports = (tokenHeader, tokenKey) => {
  const token = tokenHeader && tokenHeader.split(' ')[1];

  if (token === null || token === undefined) {
    return null;
  }

  try {
    return jwt.verify(token, tokenKey);
  } catch (e) {
    return null;
  }
};
