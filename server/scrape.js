
var later = Npm.require('later');

later.date.UTC();

var psr = later.parse.recur().every(1).minute();

SyncedCron.add({
  name: 'Turn app on',
  schedule: function(psr) {
    // parser is a later.parse object
	  return later.parse.recur().on(1).hour();		// turns on at 9pm every evening -- UTC 1am (spring/summer)
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

SyncedCron.add({
  name: 'Turn app off',
  schedule: function(psr) {
    // parser is a later.parse object
	  return later.parse.recur().on(6).hour();		// turns off  at 2am every morning -- UTC 6am (spring/summer)
  },
  job: function() {
	  Meteor.call('appOff');
  }
});

SyncedCron.add({
  name: 'Send Email',
  schedule: function(psr) {
    // parser is a later.parse object
	  return later.parse.recur().on(7).hour();		// sends email at 3am every morning -- UTC 7am (spring/summer)
	  },
  job: function() {
	Meteor.call('sendEmail')
	Meteor.call('pushFinished')
	// adding comment to reboot server
  }
});



SyncedCron.start()

	
	