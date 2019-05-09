const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  let token = req.header('Authorization');
  if (!token || (token.indexOf('Bearer') ===-1)) return res.status(401).send('Access denied. No Bearer token provided.');
  token = token.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded; 
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}