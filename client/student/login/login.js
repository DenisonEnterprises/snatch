Meteor.subscribe("users");

Template.login.events({
  "click #login": function(event, template) {
        
    Meteor.loginWithPassword(template.find("#login-username").value, template.find("#login-password").value, 
   
        function(error) {
        	if (error) {
				var used = Meteor.users.find({username: $('#login-username').val()}).count() > 0;
				document.getElementById('notifText').style.opacity='1.0'
				document.getElementById('notifText').style.visibility='visible'
				if (used){
					$('#notifText').html("Incorrect Password");
				}else{
					$('#notifText').html("Incorrect Username");
				}
		    	setTimeout(function(){
		          $('#notifText').animate({ opacity: 0 }, 1000, 'linear')
		    	}, 3000);
        	}else{
		        if (Roles.userIsInRole(Meteor.user()._id, 'employee')){
		             Router.go('backScreen'); 
		        }else if(Roles.userIsInRole(Meteor.user()._id, 'student')){
		             Router.go('menu');
 		        }else if(Roles.userIsInRole(Meteor.user()._id, 'employee2')){
 		             Router.go('employee');
  		        }else if(Roles.userIsInRole(Meteor.user()._id, 'manager')){
  		             Router.go('manager');
				}else{
					document.getElementById('notifText').style.opacity='1.0'
					document.getElementById('notifText').style.visibility='visible'
					$('#notifText').html("Check Email to Verify Account");
			    	setTimeout(function(){
			          $('#notifText').animate({ opacity: 0 }, 1000, 'linear')
			    	}, 3000);
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
	/*
  console.log("Account._verifyEmailToken", Accounts._verifyEmailToken)
  // If statement above is true, then do the verify
  if (Accounts._verifyEmailToken) {
      Accounts.verifyEmail(Accounts._verifyEmailToken);
	  console.log("Accounts verifyEmailToken", Accounts.verifyEmail(Accounts._verifyEmailToken))
	  // if this isn't done before call, then don't have verification and therefore is the problem    
      Meteor.call("makeStudent");
	  Router.go("menu");
  }
  */
  //console.log("Accounts._verifyEmailToken", Accounts._verifyEmailToken);

   if (Accounts._verifyEmailToken) {
      //console.log("Accounts._verifyEmailToken", Accounts._verifyEmailToken);

      Accounts.verifyEmail(Accounts._verifyEmailToken,
        function(error) {
          if (error) {
            //console.log('Did verifyEmail error?', error);
          } else {
            Meteor.call("makeStudent");
			Router.go("menu");
          }
        });   
   }
  
  if (Accounts._resetPasswordToken) {
	  Accounts.resetPassword(Accounts._resetPasswordToken, 'chmdance');
	  Router.go("menu");
	}
    
    
 	var type = window.location.hash.substr(1);
    if (type === "l"){
  		window.history.pushState("", "", '/');
	}else{
  	  var usr = Meteor.user()
 	   if (usr != null){
	  	 var ver = usr.emails[0].verified;
	  	if(ver && Roles.userIsInRole(Meteor.user()._id, 'student')){
		 	 Router.go("menu");
	 	 }
	  
	  	if(Roles.userIsInRole(Meteor.user()._id, 'employee')){
			 Router.go("pseudoMenu");
	  	}
	  
	  	if(Roles.userIsInRole(Meteor.user()._id, 'employee2')){
			 Router.go("employee");
	  	}
	  
	  	if(Roles.userIsInRole(Meteor.user()._id, 'manager')){
			 Router.go("manager");
	  	}
  	
		}
	
	
	}
  
 
};

Template.loading.rendered = function() {
    setInterval (type, 600);
	dots = 0
};

function type()
{
	if(dots === 2)
	{
		dots = 0
        $('#anim').text('Loading');
	}
	
    if(dots < 2)
    {
        $('#anim').append('~');
        $('#anim').prepend('~');
        dots++;
    }

	
}
