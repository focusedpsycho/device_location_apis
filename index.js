const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const users = require('./routes/users');
const authLogin = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const devices = require('./routes/devices');
const express = require('express');
const app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose.connect('mongodb+srv://backendconcoxdeveloper:V3jUV7QXqEoAtnhy@cluster0-zhjde.mongodb.net')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

// var opt = {
//   user: config.database.username,
//   pass: config.database.password,
//   auth: {
//       authdb: 'admin'
//   }
// };
// var connection = mongoose.createConnection(config.database.host, '__CONCOX__', config.database.port, opt);

app.use(express.json());
// app.use('/api/users', users);
// app.use('/api/auth', authLogin);
// app.use(authMiddleware);
app.use('/api/devices', devices);




const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));