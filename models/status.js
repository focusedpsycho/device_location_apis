const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    id: String,
    input: String,
    tag: String,
    case: String,
    imei: String,
    model: String,
    tzl: String,
    timezone: Number,
    output: String,
    createdAt: Date,
    date: String,
    terminalInfo: String,
    voltage: String,
    gsmStrength: String,
    noSatellites: Number,
    loc: Array,
    speed: Number,
    course: String,
    language: String,
    device:String
});

const Status = mongoose.model('Status', statusSchema);


module.exports = Status;
