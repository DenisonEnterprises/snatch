Meteor.subscribe('users');

Template.signupForm.rendered = function() {
  
  $('#signup-confirm-password').addClass("invalid");
  $('#signup-password').addClass("invalid");	
  $('#signup-username').addClass("invalid");
  $('#signup-email').addClass("invalid");
  $('#signup-cellphone').addClass("invalid"); 
  $('#signup-carrier').addClass("invalid");
    
  uFlag = false;
  eFlag = false;
  pFlag = false;
  cFlag = false;
  pwFlag = false;

  $('#signup-email').focusout(function() {
   if(!du){ 
    	$('#notif').html("Please Provide A denison.edu Email");
    }
   });
   
   $('#signup-cellphone').focusout(function() {
    if(!pFlag){ 
     	$('#notif').html("Please Provide 10 Digit Phone Number");
     }
    });

  $('#signup-username').on('input', function(){
  	var input=$(this).val();
	var usernameTaken = Meteor.users.find({username: input}).count() > 0;
	
	var usernameEmpty = input.length == 0;
	
	uFlag = !usernameTaken && !usernameEmpty;
	if(uFlag){
		$(this).removeClass("invalid").addClass("valid");
		$('#notif').html("");
	}else{
		$(this).removeClass("valid").addClass("invalid");
		if(usernameTaken){
			$('#notif').html("Username Taken");
		}
	}

  });

  $('#signup-email').on('input', function(){
	var input=$(this).val();
	var re = new RegExp(".*@denison\.edu");	
	var Notused = Meteor.users.find({ "profile.du": input }).count() == 0;
	du = re.test(input);
	eFlag = du && Notused;
	
	if(eFlag){
		$(this).removeClass("invalid").addClass("valid");
		$('#notif').html("");
	}else{
		$(this).removeClass("valid").addClass("invalid");
		if(!Notused){
			$('#notif').html("This Email is Already in Use");
		}
	}
 	
  });



  $('#signup-password').on('input', function(){
	var input=$(this).val();
	var input2=$('#signup-confirm-password').val();
	
	
	pwFlag = (input === input2) && input.length > 0;
	
	if(pwFlag){
		$('#signup-confirm-password').removeClass("invalid").addClass("valid");
		$(this).removeClass("invalid").addClass("valid");
		$('#notif').html("");
	}else{
		$('#signup-confirm-password').removeClass("valid").addClass("invalid");
		$(this).removeClass("valid").addClass("invalid");
		if(input.length > 0){
			$('#notif').html("Passwords Do Not Match");
		}
	}
  	
  });
 

  $('#signup-confirm-password').on('input', function(){
    var input=$(this).val();
    var input2 = $('#signup-password').val();
	
    pwFlag = (input === input2) && input.length > 0;
	
    if(pwFlag){
	  $(this).removeClass("invalid").addClass("valid");
	  $('#signup-password').removeClass("invalid").addClass("valid");
	  $('#notif').html("");
    }else{
      $(this).removeClass("valid").addClass("invalid");
	  $('#signup-password').removeClass("valid").addClass("invalid");
	  if(input.length > 0){
		$('#notif').html("Passwords Do Not Match");
	  }
    }
  });
 

  $('#signup-cellphone').on('input', function(){
    var input=$(this).val();
	pFlag = input.length == 10;
    if(pFlag){
		$(this).removeClass("invalid").addClass("valid");
		$('#notif').html("");
    }else{
		$(this).removeClass("valid").addClass("invalid");
     } 
  });
  
  
  
  $('#signup-carrier').on('input', function(){
    var input=$(this).val();
	cFlag = input != "select";
    if(cFlag){
		$(this).removeClass("invalid").addClass("valid");
		$('#notif').html("");
    }else{
		$(this).removeClass("valid").addClass("invalid");
	 	$('#notif').html("Please Select a Carrier");
     } 
  });
  
  
}



Template.signupForm.events({
  "submit #signup-form": function(event, template) {
    event.preventDefault();
      
	if(uFlag && eFlag && pFlag && cFlag && pwFlag){
        
        Accounts.createUser({
        username: template.find("#signup-username").value,
        password: template.find("#signup-password").value,
        email: template.find("#signup-email").value,
        
        profile: {
          //firstName: template.find("#signup-firstName").value,
          //lastName: template.find("#signup-lastName").value,
          cellNumber: template.find("#signup-cellphone").value,
          cellCarrier: template.find("#signup-carrier").value,
	  	  du: template.find("#signup-email").value,
          
        }
      }, function(error) {
        if (!error) {
          Router.go('thanks');  
        }
      });
    
     }else{
		 if(!uFlag){
 			$('#notif').html("Please Provide a Valid Username");
		 }
		 if(!eFlag){
 			$('#notif').html("Please Provide a Valid Email");
		 }
		 if(!pFlag){
  			$('#notif').html("Please Provide a Valid Phone Number");
		 }
		 if(!cFlag){
			 $('#notif').html("Please Select a Carrier");
		 }
		 if(!pwFlag){
			 $('#notif').html("Please Create and Confirm your Password");
		 }
     }
    
  },
  
  "click #back": function( evt, instance ){
    Router.go('/');
  },
  
  

 } );
