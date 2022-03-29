var moment = require('moment-timezone');

function possiblyCorrect (mmnt, correction) {
  if (correction && correction.length==2) {
    return mmnt.subtract(correction[0], 'hours').subtract(correction[1], 'minutes');
  }
  return mmnt;
}

function myNow (timezone, correction) {
  var now = moment(Date.now());
  if (timezone) {
    //console.log('converting', now, 'to', moment(now).tz(timezone));
    now = moment(now).tz(timezone);
  }
  return possiblyCorrect(now, correction);
}

function myNowForTime (time, zone, correction) {
  return possiblyCorrect(moment.tz(time, zone), correction);
}

module.exports = {
  possiblyCorrect: possiblyCorrect,
  now: myNow,
  nowForTime: myNowForTime
};
