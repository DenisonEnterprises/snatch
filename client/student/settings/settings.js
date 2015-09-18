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
		document.getElementById('notif').style.opacity='1.0'
		document.getElementById('notif').style.visibility='visible'
  		if(uFlag){
		 Meteor.call("uName", $('#newU').val());
		  $('#notif').html("Username Succesfully Changed");
		  $('#notif').show();
  	  	  $('#uNameForm').hide();
		  
  		}else{
  			$(this).removeClass("valid").addClass("invalid");
  			if(usernameTaken){
  				$('#notif').html("Username Taken");
			}else{
  				$('#notif').html("Please Enter A Username");
			}
  		}
    	setTimeout(function(){
          $('#notif').animate({ opacity: 0 }, 1000, 'linear')
    	}, 3000);
	 
	 

    },
	
	
    "submit #pWordForm": function(event, template) {
      event.preventDefault();
	  if(old){
		 
		  var p = $('#oldP').val();
		  Accounts.changePassword(p, p, function (error) {
			  if(error){
				  $('#notif').html("Incorrect Password");
				  document.getElementById('notif').style.opacity='1.0'
				  document.getElementById('notif').style.visibility='visible'
		      	  setTimeout(function(){
		            $('#notif').animate({ opacity: 0 }, 1000, 'linear')
		      	  }, 3000);
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
		  
		  
		  document.getElementById('notif').style.opacity='1.0'
		  document.getElementById('notif').style.visibility='visible'

		  if(p1 === p2){
				 
				 
			  Accounts.changePassword(previous, p1, function (error) {
				  if(error){
					  $('#notif').html("An Unknown Issue Occured. Please Try Again.");
				  }else{
				  	  $('#new').hide();
					  $('#pWordForm').hide();
		  
					  $('#notif').html("Password Succesfully Changed");
				  }

			  });
				 
				 
		  }else{
			  $('#notif').html("Passwords Do Not Match");
			  $('#notif').show();
		  }
		  
      	  setTimeout(function(){
            $('#notif').animate({ opacity: 0 }, 1000, 'linear')
      	  }, 3000);
		  	 
	  }
    },
	
});




Template.settings.helpers({
    appOn:function(){
		var app = Instance.findOne({name: "bandersnatch"}); 
		if(app.status == "on"){
			return true;
		}else{
			return false;
		}

    }
});
