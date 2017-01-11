
var later = Npm.require('later');
/*var moment = Npm.require("moment-timezone");

var timezone = "America/Kentucky/Louisville";
var start_date = new Date();

var zone = moment.tz.zone(timezone);
var offset = zone.offset(start_date);

var now = new moment(start_date);
now.subtract(offset, "minutes"); */

later.date.localTime();

var psr = later.parse.recur().every(1).minute();

SyncedCron.add({
  name: 'Turn app off',
  schedule: function(psr) {
    // parser is a later.parse object
	  return later.parse.recur().on(7).hour();		// turns off  at 2am every morning -- UTC 7am
  },
  job: function() {
	  Meteor.call('appOff');
  }
});

SyncedCron.add({
  name: 'Send Email',
  schedule: function(psr) {
    // parser is a later.parse object
	  return later.parse.recur().on(8).hour();		// sends email at 3am every morning -- UTC 8am
	  },
  job: function() {
	Meteor.call('sendEmail')
	Meteor.call('pushFinished')
	// adding comment to reboot server
  }
});

SyncedCron.add({
  name: 'Turn app on',
  schedule: function(psr) {
    // parser is a later.parse object
	  return later.parse.recur().on(2).hour();		// turns on at 9pm every evening -- UTC 2am
  },
  job: function() {
	// turn the app on and reset order numbers
	Meteor.call('appOn');
	var app = Instance.findOne({name: 'bandersnatch'});
	if(app.status == 'on'){
		Meteor.call('resetOrNum');	
	}
	
	// adding comment to reboot server
  }
});



SyncedCron.start()

	
	