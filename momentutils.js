var moment = require('moment-timezone');

function myNow (timezone) {
  var now = moment(Date.now());
  if (timezone) {
    //console.log('converting', now, 'to', moment(now).tz(timezone));
    now = moment(now).tz(timezone);
  }
  return now;
}

function myNowForTime (time, zone) {
  return moment.tz(time, zone);
}

module.exports = {
  now: myNow,
  nowForTime: myNowForTime
};
