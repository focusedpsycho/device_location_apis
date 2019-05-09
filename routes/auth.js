const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
      return res.status(401).json({ message: 'Missing Authorization Header' });
  }
  const base64Credentials =  req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  try{
    let user = await User.findOne({ username: username });
    if (!user) return res.status(400).send('Invalid username or password.');
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid username or password.');
    req.user = user
    const token = user.generateAuthToken();
    res.send(token);
  }

  catch(ex){
    res.status(500).send(ex.message);
  }
});


module.exports = router; 
