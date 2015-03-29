Template.settings.events({
    "click #rmAccount": function( evt, instance ){
		$('#uNameForm').hide();
		$('#pWordForm').hide();
		$('#delForm').show();
    },
	
    "click #changePassword": function( evt, instance ){
		$('#uNameForm').hide();
		$('#delForm').hide();
		
		$('#old').show();
		$('#new').hide();
		
		$('#pwSubmit').html("Next");
		
		$('#pWordForm').show();
		old = true;
		
    },
	
    "click #changeUsername": function( evt, instance ){
		$('#pWordForm').hide();
		$('#delForm').hide();
		$('#uNameForm').show();
		
    },
	
    "click #back": function( evt, instance ){
		$('#pWordForm').hide();
		$('#delForm').hide();
		$('#uNameForm').hide();
		Router.go("menu");
    },
	
		
    "click #no": function( evt, instance ){
		$('#delForm').hide();
    },
	
    "click #yes": function( evt, instance ){
		$('#delForm').hide();
		Meteor.call("remo");
		Router.go("/");
    },
	
	
	
	
    "submit #uNameForm": function(event, template) {
      	event.preventDefault();
	  
     	var input=$($('#newU')).val();
		
  		var usernameTaken = Meteor.users.find({username: input}).count() > 0;
  		var usernameEmpty = input.length == 0;
  		uFlag = !usernameTaken && !usernameEmpty;
  		if(uFlag){
		 Meteor.call("uName", $('#newU').val());
		  $('#notif').html("Username Succesfully Changed");
		  $('#notif').show();
  	  	  $('#uNameForm').hide();
		  
  		}else{
  			$(this).removeClass("valid").addClass("invalid");
  			if(usernameTaken){
  				$('#notif').html("Username Taken");
	  		 	$('#notif').show();
				
			}else{
  				$('#notif').html("Please Enter A Username");
	  		 	$('#notif').show();
				
			}
  		}
  	
	 
	 

    },
	
	
    "submit #pWordForm": function(event, template) {
      event.preventDefault();
	  if(old){
		 
		  var p = $('#oldP').val();
		  Accounts.changePassword(p, p, function (error) {
			  if(error){
				  $('#notif').html("Incorrect Password");
				  $('#notif').show();
			  }else{
				  old = false;
				  $('#old').hide();
				  $('#new').show();
		  	      $('#pwSubmit').html("Change");
				  $('#notif').hide();
				  previous = p;
			  }

		  });
		  
		  
	  }else{
		  //actual change password
		  
		  var p1 = $('#newP').val();
		  var p2 =  $('#cnp').val();
		  
		  if(p1 === p2){
				 
				 
			  Accounts.changePassword(previous, p1, function (error) {
				  if(error){
					  $('#notif').html("An Unknown Issue Occured. Please Try Again.");
					  $('#notif').show();
				  }else{
				  	  $('#new').hide();
					  $('#pWordForm').hide();
		  
		  
		  
					  $('#notif').html("Password Succesfully Changed");
					  $('#notif').show();
				  }

			  });
				 
				 
		  }else{
			  $('#notif').html("Passwords Do Not Match");
			  $('#notif').show();
		  }
		  
		  
		  
		  
	  	 
	  }
    },
	
	
	
	
});