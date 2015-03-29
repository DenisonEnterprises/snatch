Meteor.subscribe('users');

Template.forgot.events({
    "click #back": function( evt, instance ){
		$('#notif').hide();
		Router.go('/');
    },
	
    "submit #forgotForm": function(event, template) {
      	event.preventDefault();
	  
     	var input=$($('#email')).val();
		
  		var emailExists = Meteor.users.find({'profile.du': input}).count() > 0;
  		
  		if(emailExists){
		
			Accounts.forgotPassword({email: input}, function(err) {
			        if (err) {
  			  		  $('#notif').html("An Unknown Error Occurred - Please Try Again.");
  			  		  $('#notif').show();
			        } else {
			  		  $('#notif').html("Email Sent");
			  		  $('#notif').show();
			        }
			});		
		
		  
  		}else{
  			$('#notif').html("Invalid Email");
	  		$('#notif').show();
		}
  		

    },
	
});