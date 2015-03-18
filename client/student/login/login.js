Template.login.events({
  "submit #login-form": function(event, template) {
    event.preventDefault();
    
    
    
    
    Meteor.loginWithPassword(template.find("#login-username").value, template.find("#login-password").value, 
   
        function(error) {
        	if (error) {
				$('#notifText').html("Incorrect Password");
        	}
      	});
    
      if (Roles.userIsInRole(Meteor.user()._id, 'employee')){
           window.location.href = '/employee'; 
      }else if(Roles.userIsInRole(Meteor.user()._id, 'student')){
           window.location.href = '/menu';
      }else{
           console.log("NOT WORKING");
           console.log(Meteor.user()._id);
           //window.location.href = '/denied';
      }
    
  },
  
  "click #signUp": function(evt, template) {
	  Router.go("signup");
  }
});



Template.login.created = function() {
  if (Accounts._verifyEmailToken) {
      Accounts.verifyEmail(Accounts._verifyEmailToken);    
      Meteor.call("makeStudent");
	  Router.go("menu");
  }
};
