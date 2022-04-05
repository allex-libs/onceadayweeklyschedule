var moment = require('moment-timezone');
var schs = [{
  timezone: 'America/New_York',
  weekdays: [0, 1, 2, 3, 4, 5],
  time: [23, 55]
},{
  timezone: 'Europe/London',
  weekdays: [0, 1, 2, 3, 4, 5],
  time: [23, 55]
}];

var tests = [
  ['2022-04-05 22:00', '2022-04-04 23:55'],
  ['2022-04-05 23:54:59', '2022-04-04 23:55'],
  ['2022-04-05 23:55:00', '2022-04-05 23:55'],
  ['2022-04-06 00:00', '2022-04-05 23:55'],
  ['2022-04-06 23:54:59', '2022-04-05 23:55']
]

function testSchedules (test) {
  var fakenow = test[0], schedfor = test[1];
  schs.forEach(function (sch, ind) {
    var schedule = getGlobal(ind),
      schdfortimestamp,
      schdfordate,
      schdfordatecheck;
    if (!schedule) {
      console.log('no schedule for', sch);
      return;
    }
    ScheduleClass.fakeNow = {time:fakenow, zone:sch.timezone};
    schdfortimestamp = schedule.scheduledFor();
    schdfordate = moment.tz(schdfortimestamp, sch.timezone);
    schdfordatecheck = moment.tz(schedfor, sch.timezone);
    if (schdfordate-schdfordatecheck) {
      throw new Error('Now it is '+ScheduleClass.fakeNow.time+' in '+ScheduleClass.fakeNow.zone+', schedule is scheduledFor '+schdfordate.toDate()+', but the test wanted '+schdfordatecheck.toDate());
    }
    console.log(('Now it is '+ScheduleClass.fakeNow.time+' in '+ScheduleClass.fakeNow.zone+', schedule is scheduledFor '+schdfordate.toDate()+', and the test wanted '+schdfordatecheck.toDate()));
    //expect(trigger/60/1000).to.equal(exp[ind]);
    //console.log(sch.time, '=>', trigger/60/1000, 'shouldve been', exp[ind]);
  });
}

describe ('Test Schedule scheduledFor', function () {
  it ('Load Schedule Class', function () {
    return setGlobal('ScheduleClass', require('../index')(execlib));
  });
  it ('Instantiate Schedule', function () {
    schs.forEach(function (sch, index) {
      setGlobal(index, new ScheduleClass(sch));
    });
  });
  it ('Time?', function () {
    tests.forEach(testSchedules);
  });
});