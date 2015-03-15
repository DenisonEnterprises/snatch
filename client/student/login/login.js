Template.login.events({
  "submit #login-form": function(event, template) {
    event.preventDefault();
    
    
    
    
    Meteor.loginWithPassword(template.find("#login-username").value, template.find("#login-password").value, 
   
        function(error) {
        if (error) {
          $("#loginText").html(error);
          
          $('#loginText').css('background-image', 'url(/img/verified.jpg)');
          $('#loginText').css('border', 'solid white 2px');
          
          $("#loginText").fadeIn(2000);
          
          setTimeout(function(){
              $("#loginText").fadeOut(2000);
           }, 4000);

        }
          else{
            
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
    
  }
});



Template.login.created = function() {
  if (Accounts._verifyEmailToken) {
    Accounts.verifyEmail(Accounts._verifyEmailToken);    
    Meteor.call("makeStudent");
    
    
    

  }
};
