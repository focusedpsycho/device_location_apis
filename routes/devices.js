
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const Device = require('../models/devices');
const Status = require('../models/status');
const moment = require('moment');

router.get('/all', async (req, res) => {
  try{
    const devices = await Device.find({}).lean();
    res.send(devices);
  }
  catch(ex){
      console.log(ex.message);
      res.status(500).send(ex.message);
  }
});

router.get('/:deviceId', async (req, res) => {
    try{

      const device = await Device.findOne({id: req.params.deviceId}).lean();
      if(!device){
          return res.status(400).send('Invalid device ID');
      }
      const page = (req.query.page && req.query.page >0) ? req.query.page: 1;
      const skip = (page-1)*10;
      const status = await Status.find({device: req.params.deviceId, gps: { $exists: true, $not: {$size: 0} } }, 
        {device:1, gps:1, createdAt:1, time:1, tag:1}).sort({time: -1, createdAt: -1}).skip(skip).limit(10).lean();
      const deviceStatuses = [];
      for(let i=0;i<status.length;i++){
           const statusObject = {};
           statusObject.time = status[i].time ? moment(status[i].time).format('DD/MM/YYYY hh:mm:ss a') : 'NA';
           statusObject.createdAt =  moment(status[i].createdAt).format('DD/MM/YYYY hh:mm:ss a');
           statusObject.gps = status[i].gps;
           statusObject.device = status[i].device;
           statusObject.message = status[i].tag;
           deviceStatuses.push(statusObject) 
           
      }
     
      res.send(deviceStatuses);
    }
    catch(ex){
        console.log(ex.message);
        res.status(500).send(ex.message);
    }
  });


  router.get('/:deviceId/halts', async (req, res) => {
    try{
      const device = await Device.findOne({id: req.params.deviceId}).lean();
      if(!device){
          return res.status(400).send('Invalid device ID');
      }

      const allLocations = await Status.find({device: req.params.deviceId, 
        gps: { $exists: true, $not: {$size: 0} } }, 
        {device:1, gps:1, createdAt:1, time:1}).lean();

        const haltResponse = [];
        let startOfHalt = 0, endOfHalt = 1;
      while(startOfHalt<=endOfHalt && endOfHalt<allLocations.length){           
             if(distanceBetweenCoordinates(allLocations[startOfHalt].gps[0], allLocations[startOfHalt].gps[1],
                allLocations[endOfHalt].gps[0], allLocations[endOfHalt].gps[1]) <= 0.1){
                     endOfHalt++;
                 }
            else if(startOfHalt!== endOfHalt){
               const haltStartTime = allLocations[startOfHalt].time || allLocations[startOfHalt].createdAt;
               const haltEndTime = allLocations[endOfHalt-1].time || allLocations[endOfHalt-1].createdAt;

               const timeDifference = moment.duration(moment(haltEndTime).diff(haltStartTime)).asMinutes();
               if(timeDifference>=15){
                   haltResponse.push({
                       haltStartTime: moment(haltStartTime).format('DD/MM/YYYY hh:mm:ss a'),
                       haltEndTime: moment(haltEndTime).format('DD/MM/YYYY hh:mm:ss a'),
                       haltTime: Math.round(timeDifference) + ' Minutes'
                   })
               }

               startOfHalt = endOfHalt;
               endOfHalt++;

            }

      }
      

      res.send(haltResponse);
    }
    catch(ex){
        console.log(ex);
        res.status(500).send(ex.message);
    }
  });

  function distanceBetweenCoordinates(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }



module.exports = router; 
