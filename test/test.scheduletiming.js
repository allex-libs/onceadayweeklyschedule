var schs = [{
  timezone: 'America/Nome',
  weekdays: [0, 1, 2, 3, 4, 5],
  time: [2, 0]
},{
  timezone: 'America/Nome',
  weekdays: [0, 1, 2, 3, 4, 5],
  time: [1, 58]
}];

//fakenow, expected in X minutes; where null, it is because the schedule's now 
//will fall into Saturday
var tests = [
  ['2016-03-10 03:00', [-60, -62]], //actually 2016-03-10 02:00
  ['2016-03-13 02:00', [0, -2]], //actually 2016-03-13 03:00
  ['2016-03-13 02:01', [-1, -3]], //actually 2016-03-13 03:01
  ['2016-03-13 01:59', [null, -1]], //actually 2016-03-13 01:59
  ['2016-03-13 03:00', [0, -2]], //actually 2016-03-13 03:00
  ['2016-03-13 03:01', [-1, -3]], //actually 2016-03-13 03:01
  ['2016-03-13 02:59', [-59, -61]], //actually 2016-03-13 03:59
  ['2016-11-06 00:00', [null, null]], //actually 2016-11-06 00:00, offset still -8
  ['2016-11-06 01:59', [null, -1]], //actually 2016-11-06 01:59, first occurence, offset still -8
  ['2016-11-06 02:00', [0, -62]], //actually 2016-11-06 02:00, second occurence, offset changed to -8
  ['2016-11-06 01:59:00-09:00', [1, -61]], //actually 2016-11-06 01:59, second occurence, offset changed to -9
  ['2016-11-06 02:01', [-1, -63]] //actually 2016-11-06 02:01, offset changed to -8
];


function testSchedules (test) {
  var fakenow = test[0], exp = test[1];
  schs.forEach(function (sch, ind) {
    var schedule = getGlobal(ind),
      fulltrigger,
      trigger;
    if (!schedule) {
      console.log('no schedule for', sch);
      return;
    }
    ScheduleClass.fakeNow = {time:fakenow, zone:sch.timezone};
    fulltrigger = schedule.estimateTrigger();
    trigger = fulltrigger == null ? null :fulltrigger/60/1000; 
    if (trigger !== exp[ind]) {
      throw new Error('Now it is '+ScheduleClass.fakeNow.time+' in '+ScheduleClass.fakeNow.zone+', schedule '+sch.name+' is set to '+schedule.options.time.join(':')+', expected to fire in '+exp[ind]+', but the schedule said '+trigger);
    }
    //expect(trigger/60/1000).to.equal(exp[ind]);
    //console.log(sch.time, '=>', trigger/60/1000, 'shouldve been', exp[ind]);
  });
}

describe ('Test schedule', function () {
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
