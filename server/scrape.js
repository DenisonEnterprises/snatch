
var later = Npm.require('later');

console.log('find')
later.date.localTime();
var psr = later.parse.recur().every(1).minute();
// var psr = later.parse.recur().on(3).hour();

SyncedCron.add({
  name: 'Turn app off',
  schedule: function(psr) {
    // parser is a later.parse object
	  return later.parse.recur().on(2).hour();		// turns off  at 3am every morning 
  },
  job: function() {
	  Meteor.call('appOff');
  }
});

SyncedCron.add({
  name: 'Send Email',
  schedule: function(psr) {
    // parser is a later.parse object
	  return later.parse.recur().on(3).hour();		// turns on at 9pm every evening 
  },
  job: function() {
	Meteor.call('sendEmail')
	// adding comment to reboot server
  }
});

SyncedCron.add({
  name: 'Turn app on',
  schedule: function(psr) {
    // parser is a later.parse object
	  return later.parse.recur().on(21).hour();		// turns on at 9pm every evening 
  },
  job: function() {
	Meteor.call('appOn')
	// adding comment to reboot server
  }
});



SyncedCron.start()

	
	