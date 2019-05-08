
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const Device = require('../models/devices');

router.get('/all', async (req, res) => {
  try{
    console.log('here')
    const devices = await Device.find({});
    res.send(devices);
  }
  catch(ex){
      console.log(ex.message);
      res.status(500).send(ex.message);
  }
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router; 
