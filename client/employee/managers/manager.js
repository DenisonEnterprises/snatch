Meteor.subscribe('instance');

Template.manager.rendered = function(){
	var app = Instance.findOne({name: "bandersnatch"}); 
	$('#notif2').hide();
	if(app.status == "on"){
		$('#notif').html("App is currently running");
		$('#on').hide();
		$('#off').show();
	}else{
		$('#notif').html("App is currently off");
		$('#on').show();
		$('#off').hide();
	}
};


Template.manager.events({
	'click #on': function(evt) {
		Meteor.call("appOn");
		$('#notif').html("App is currently running");
		$('#on').hide();
		$('#off').show();
	},
	
	'click #off': function(evt) {
		Meteor.call("appOff");
		$('#notif').html("App is currently off");
		$('#on').show();
		$('#off').hide();
	},

	'click #sendEmail': function(evt){
		Meteor.call('sendEmail');
		Meteor.call('pushFinished');
		$('#notif2').show();
   	  	setTimeout(function(){
          $("#notif2").fadeOut(1000);
   	 	}, 3000);
	}
});
