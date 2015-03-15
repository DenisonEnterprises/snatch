Template.signupForm.rendered = function() {
  
  $('#signup-confirm-password').addClass("invalid");
  $('#signup-password').addClass("invalid");	
  $('#signup-username').addClass("invalid");
  $('#signup-email').addClass("invalid");
  $('#signup-cellphone').addClass("invalid"); 
  $('#signup-carrier').addClass("invalid");
  $('#notif').hide(); 



  $('#signup-username').focusout(function() {
   if(!uFlag){ 
        $('#notif').html("Username Taken");
	$('#notif').show();
      }
   });



  $('#signup-username').on('input', function(){
  	var input=$(this).val();
	var used = Meteor.users.find({username: input}).count() == 0;
	uFlag = input.length > 0 && used;
	if(uFlag){
		$(this).removeClass("invalid").addClass("valid");
	}else{
		$(this).removeClass("valid").addClass("invalid");
	}

  });

  

  $('#signup-password').on('input', function(){
	var input=$(this).val();
	if(input.length > 0){
		$(this).removeClass("invalid").addClass("valid");
	}else{
		$(this).removeClass("valid").addClass("invalid");
	}

	var input2=$('#signup-confirm-password').val();
	if(input === input2){
		$('#signup-confirm-password').removeClass("invalid").addClass("valid");
	}else{
		$('#signup-confirm-password').removeClass("valid").addClass("invalid");
	}
  	
  });


  $('#signup-email').on('input', function(){
	var input=$(this).val();
	console.log(input);
	var re = new RegExp(".*@denison\.edu");	
	var Notused = Meteor.users.find({ "profile.du": input }).count() == 0;
	var du = re.test(input);
	if(du && Notused){
		$(this).removeClass("invalid").addClass("valid");
	}else{
		$(this).removeClass("valid").addClass("invalid");
	}
 	
  });


  $('#signup-confirm-password').on('input', function(){
    var input=$(this).val();
    var input2 = $('#signup-password').val();
    
    if(input === input2){
      $(this).removeClass("invalid").addClass("valid");
    }else{
      $(this).removeClass("valid").addClass("invalid");
    }
  });
 

  $('#signup-cellphone').on('input', function(){
    var input=$(this).val();
    if(input.length == 10){
	$(this).removeClass("invalid").addClass("valid");
    }else{
	$(this).removeClass("valid").addClass("invalid");
     } 
  });
}

Template.signupForm.events({
  "submit #signup-form": function(event, template) {
    event.preventDefault();
      
    /*if(Meteor.users.find({'emails.address': template.find("#signup-email")}).count() > 0){
        document.getElementById('signup-email-lbl').style.color = "red";
    }else{
    */    //CATCH ERRORS    
    
    
      if(template.find("#signup-carrier").value === "select"){
        document.getElementById('signup-email-lbl').style.color = "red";
      }else{
    
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
        if (error) {
            console.log("SIGNUP ERROR");
            //WRITE TO SCREEN
        }else{
          window.location.href = '/thanks';  
        }
      });
    
     } // end else
    
  },
  
  "click #back": function( evt, instance ){
    Router.go('/');
  },
  

  

 } );
