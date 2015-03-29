Template.login.events({
  "submit #login-form": function(event, template) {
    event.preventDefault();
    
    
    
    
    Meteor.loginWithPassword(template.find("#login-username").value, template.find("#login-password").value, 
   
        function(error) {
        	if (error) {
				var used = Meteor.users.find({username: $('#login-username').val()}).count() > 0;
				if (used){
					$('#notifText').html("Incorrect Password");
					$('#notifText').show();
				}else{
					$('#notifText').html("Incorrect Username");
					$('#notifText').show();
				}
        	}else{
        		
		        if (Roles.userIsInRole(Meteor.user()._id, 'employee')){
		             Router.go('backScreen'); 
		        }else if(Roles.userIsInRole(Meteor.user()._id, 'student')){
		             Router.go('menu');
		        }
				
        	}
      	});
    
    
  },
  
  "click #signUp": function(evt, template) {
	  Router.go("signup");
  },
  
  "click #forgot": function(evt, template) {
	  Router.go("forgot");
  },
  
});



Template.login.rendered = function() {
  if (Accounts._verifyEmailToken) {
      Accounts.verifyEmail(Accounts._verifyEmailToken);    
      Meteor.call("makeStudent");
	  Router.go("menu");
  }
  
  if (Accounts._resetPasswordToken) {
	  Accounts.resetPassword(Accounts._resetPasswordToken, 'nick');
	  Router.go("menu");
	}
  
  console.log("rendered");
  
    
  var usr = Meteor.user()
  if (usr != null){
	  var ver = usr.emails[0].verified;
	  if(ver && Roles.userIsInRole(Meteor.user()._id, 'student')){
		  Router.go("menu");
	  }
	  
	  if(Roles.userIsInRole(Meteor.user()._id, 'employee')){
		 // Router.go("pseudoMenu");
	  }
  }
};
