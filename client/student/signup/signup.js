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
    	$('#notif').html("Please Provide a denison.edu Email");
		document.getElementById('notif').style.opacity='1.0'
		document.getElementById('notif').style.visibility='visible'
    	setTimeout(function(){
          $('#notif').animate({ opacity: 0 }, 1000, 'linear')
    	}, 3000);
    }
   });
   
   $('#signup-cellphone').focusout(function() {
    if(!pFlag){ 
     	$('#notif').html("Please Provide 10 Digit Phone Number");
		document.getElementById('notif').style.opacity='1.0'
		document.getElementById('notif').style.visibility='visible'
    	setTimeout(function(){
          $('#notif').animate({ opacity: 0 }, 1000, 'linear')
    	}, 3000);
     }
    });

  $('#signup-username').on('input', function(){
  	var input=$(this).val();
	var usernameTaken = Meteor.users.find({username: input}).count() > 0;
	
	var usernameEmpty = input.length == 0;
	
	uFlag = !usernameTaken && !usernameEmpty;
	if(uFlag){
		$(this).removeClass("invalid").addClass("valid");
	}else{
		$(this).removeClass("valid").addClass("invalid");
		if(usernameTaken){
			$('#notif').html("Username Taken");
			document.getElementById('notif').style.opacity='1.0'
			document.getElementById('notif').style.visibility='visible'
	    	setTimeout(function(){
	          $('#notif').animate({ opacity: 0 }, 1000, 'linear')
	    	}, 3000);
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
	}else{
		$(this).removeClass("valid").addClass("invalid");
		if(!Notused){
			$('#notif').html("This Email is Already in Use");
			document.getElementById('notif').style.opacity='1.0'
			document.getElementById('notif').style.visibility='visible'
	    	setTimeout(function(){
	          $('#notif').animate({ opacity: 0 }, 1000, 'linear')
	    	}, 3000);
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
	}else{
		$('#signup-confirm-password').removeClass("valid").addClass("invalid");
		$(this).removeClass("valid").addClass("invalid");
		if(input.length > 0){
			$('#notif').html("Passwords Do Not Match");
			document.getElementById('notif').style.opacity='1.0'
			document.getElementById('notif').style.visibility='visible'
	    	setTimeout(function(){
	          $('#notif').animate({ opacity: 0 }, 1000, 'linear')
	    	}, 3000);
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
    }else{
      $(this).removeClass("valid").addClass("invalid");
	  $('#signup-password').removeClass("valid").addClass("invalid");
	  if(input.length > 0){
		$('#notif').html("Passwords Do Not Match");
		document.getElementById('notif').style.opacity='1.0'
		document.getElementById('notif').style.visibility='visible'
    	setTimeout(function(){
          $('#notif').animate({ opacity: 0 }, 1000, 'linear')
    	}, 3000);
	  }
    }
  });
 

  $('#signup-cellphone').on('input', function(){
    var input=$(this).val();
	pFlag = true;
	pFlag = (input.length == 10) && /^([0-9]+)$/.test(input);
    if(pFlag){
		$(this).removeClass("invalid").addClass("valid");
    }else{
		$(this).removeClass("valid").addClass("invalid");
     } 
  });
  
  
  
  $('#signup-carrier').on('input', function(){
    var input=$(this).val();
	cFlag = (input != "select");
    if(cFlag){
		$(this).removeClass("invalid").addClass("valid");
    }else{
		$(this).removeClass("valid").addClass("invalid");
	 	$('#notif').html("Please Select a Carrier");
		document.getElementById('notif').style.opacity='1.0'
		document.getElementById('notif').style.visibility='visible'
    	setTimeout(function(){
          $('#notif').animate({ opacity: 0 }, 1000, 'linear')
    	}, 3000);
     } 
  });
  
  
}



Template.signupForm.events({
  "click #signup-form": function(event, template) {
    event.preventDefault();
	console.log('SUBMITTING');
      
	if(uFlag && eFlag && pFlag && cFlag && pwFlag){
        
        Accounts.createUser({
        username: template.find("#signup-username").value,
        password: template.find("#signup-password").value,
        email: template.find("#signup-email").value,
        
        profile: {
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
			document.getElementById('notif').style.opacity='1.0'
			document.getElementById('notif').style.visibility='visible'
	    	setTimeout(function(){
	          $('#notif').animate({ opacity: 0 }, 1000, 'linear')
	    	}, 3000);
		 }
		 if(!eFlag){
 			$('#notif').html("Please Provide a Valid Email");
			document.getElementById('notif').style.opacity='1.0'
			document.getElementById('notif').style.visibility='visible'
	    	setTimeout(function(){
	          $('#notif').animate({ opacity: 0 }, 1000, 'linear')
	    	}, 3000);
		 }
		 if(!pFlag){
  			$('#notif').html("Please Provide a Valid Phone Number");
			document.getElementById('notif').style.opacity='1.0'
			document.getElementById('notif').style.visibility='visible'
	    	setTimeout(function(){
	          $('#notif').animate({ opacity: 0 }, 1000, 'linear')
	    	}, 3000);
		 }
		 if(!cFlag){
			 $('#notif').html("Please Select a Carrier");
	 		document.getElementById('notif').style.opacity='1.0'
	 		document.getElementById('notif').style.visibility='visible'
	     	setTimeout(function(){
	           $('#notif').animate({ opacity: 0 }, 1000, 'linear')
	     	}, 3000);
		 }
		 if(!pwFlag){
			 $('#notif').html("Please Create and Confirm your Password");
	 		document.getElementById('notif').style.opacity='1.0'
	 		document.getElementById('notif').style.visibility='visible'
	     	setTimeout(function(){
	           $('#notif').animate({ opacity: 0 }, 1000, 'linear')
	     	}, 3000);
		 }
     }
    
  },
  
  "click #back": function( evt, instance ){
    Router.go('/');
  },
  
  

 } );
