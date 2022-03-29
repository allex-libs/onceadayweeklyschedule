var moment = require('moment-timezone'),
  momentutils = require('./momentutils');

function createSchedule (execlib) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q,
    Node = require('allex_nodehelpersserverruntimelib')(execlib.lib),
    Path = Node.Path,
    fs = Node.Fs;

  function Schedule (descriptor) {
    this.options = descriptor;
  }
  Schedule.prototype.destroy = function () {
    this.options = null;
  };
  /**
   * returns
   * null if should not be ran
   * ret <= 0 if should be ran immediately
   * ret > 0 if should be ran in ret milliseconds
   */
  Schedule.prototype.estimateTrigger = function () {
    if (!this.options) {
      return null;
    }
    if (lib.isArray(this.options.weekdays)) {
      if (lib.isArray(this.options.time)) {
        return this.estimateDailyTrigger();
      }
      if (this.options.trigger) {
        return 0;
      }
    }
  };
  Schedule.prototype.targetMoment = function (now) {
    now = now || this.now();
    return this.timeOfHoursMinutes(now, this.options.time[0], this.options.time[1]);
  };
  Schedule.prototype.targetTimestamp = function (now) {
    return this.targetMoment(now).toDate().valueOf();
  };
  Schedule.prototype.estimateDailyTrigger = function () {
    var now = this.now(),
      day = now.day(),
      hour = now.hour(),
      minute = now.minute(),
      target,
      tz,
      offnow,
      off;
  
    if (this.options.weekdays.indexOf(day)>=0) {
      target = this.targetMoment(now);
      //console.log('diff');
      //console.log('target', target, this.options.time);
      //console.log('   now', now, Schedule.fakeNow);
      if (this.options && this.options.timezone) {
        tz = moment.tz.zone(this.options.timezone);
        //console.log('offsets', tz.offset(now), tz.offset(target));
      }
      return target.diff(now);
    }

    //console.log(now, day, hour, minute);
    return null;
  };
  Schedule.prototype.now = function () {
    var now, time;
    time = this.options ? this.options.time : null;
    if (Schedule.fakeNow) {
      return momentutils.nowForTime(Schedule.fakeNow.time, Schedule.fakeNow.zone, time);
    }
    return momentutils.now(this.options ? this.options.timezone : null, time);
  };
  Schedule.prototype.timeOfHoursMinutes = function (time, hours, minutes) {
    if (this.options && this.options.timezone) {
      //console.log('copying', time, 'with', hours, minutes, this.options.timezone);
      return momentutils.possiblyCorrect(
        moment.tz({year: time.year(), month: time.month(), day: time.date(), hour: hours, minute: minutes, second: 0, millisecond: 0}, this.options.timezone),
        this.options ? this.options.time : null
      );
    }
    return momentutils.possiblyCorrect(
      moment({year: time.year(), month: time.month(), day: time.date(), hour: hours, minute: minutes, second: 0, millisecond: 0}),
      this.options ? this.options.time : null
    );
  };
  Schedule.prototype.currDay = function (format) {
    return (this.now()).format(format||'YYYYMMDD');
  };
  Schedule.prototype.currTime = function (format) {
    return (this.now()).format(format||'HHmm');
  };
  Schedule.fakeNow = null;

  return Schedule;
}

module.exports = createSchedule;
