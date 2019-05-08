const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
   id:String,
   imei:String,
   client:String,
   sim:String,
   tel:String,
   createdAt: Date
   
});

const Device = mongoose.model('Device', deviceSchema);


module.exports = Device; 
