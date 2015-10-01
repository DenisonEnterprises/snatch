Meteor.subscribe('instance');

Template.manager.rendered = function(){
	var app = Instance.findOne({name: "bandersnatch"}); 
	$('#notif2').hide();
	if(app.status == "on"){
		$('#notif').html("App is currently running");
		$('#on').hide();
		$('#off').show();
	}else{
		$('#notif').html("App is currently off");
		$('#on').show();
		$('#off').hide();
	}
	
};

Template.manager.helpers({

	'bev': function(){
		return Beverages.find().fetch();
	},
	'snack': function(){
		return Snacks.find().fetch(); 
	},
	'bagel': function(){
		return Bagels.find().fetch();
	},
	'mixin': function(){
		return Milkshakes.find({type: "mixin"}).fetch(); 
	},
	'flavor': function(){
		return Milkshakes.find({type:'flavor'}).fetch();
	}
});

Template.manager.events({
	'click #on': function(evt) {
		Meteor.call("appOn");
		$('#notif').html("App is currently running");
		$('#on').hide();
		$('#off').show();
	},
	
	'click #off': function(evt) {
		Meteor.call("appOff");
		$('#notif').html("App is currently off");
		$('#on').show();
		$('#off').hide();
	},

	'click #sendEmail': function(evt){
		/* for loop that pulls all names from ul list and separated by ';' */
		
		/*var emails = []; 
		var emailChain; 
		count = 0; 
		$('#emailList').each(function(){
			$(this).find('li').each(function(){
				emailChain = ''; 
				emailChain += $(this).text();
				if(count = 0){
					emails.push(emailChain.slice(1));
				}
				count++; 
				emailChain += ', ';
				emails.push(emailChain.slice(1));
			});
		});
		console.log("emails: ", emails);

		Meteor.call('sendEmail', emails, function(error,result) {
				if (error)
					return alert(error.reason); 
			});
		//Meteor.call('pushFinished');
		*/
		$('#notif2').show();
   	  	setTimeout(function(){
          $("#notif2").fadeOut(1000);
   	 	}, 3000);
	},
	
	'click .button-check': function(evt){
		var recipID = $('.button-check').attr('id'); 
		console.log('recipID ', recipID);
		//var delPerson = $(recipID).text();
		//console.log('delPerson: ', delPerson);
		//li.remove(); 
	},
	
	'click #addRecip': function(evt){
		var ELcount = 0;
		var recip = $('#recieveEmail').val(); 
		var ul = document.getElementById('emailList');
		$('#menu-selected').each(function(){
			ELcount++;
		});
	    var li = document.createElement("li");
		li.setAttribute('id','menu-selected');
		var btn = document.createElement('BUTTON');
		btn.appendChild(document.createTextNode('X'));
		console.log('ELcount: ', ELcount);
		// the sum to find ID is being a shit and not updating
		btn.setAttribute('id', 'delRecip' + ELcount++);
		btn.setAttribute('class', 'button-check');
		li.appendChild(btn);
		li.appendChild(document.createTextNode(recip));
		ul.appendChild(li);
	},
	
	'click #addNewItem': function(evt){
		var itemType = $("#itemType").val(); 
		var itemName = $($("#itemTitle")).val();
		var itemPrice = parseFloat($($("#dollar")).val() + "." + $($("#cents")).val()); 
		Meteor.call('addNewItem',itemType, itemName, itemPrice, function(error,result) {
				if (error)
					return alert(error.reason); 
			});
		$('#notifAdded').show();
   	  	setTimeout(function(){
          $("#notifAdded").fadeOut(1000);
   	 	}, 3000);
	},

	'click #delThis': function(evt){
		var itemType = $('#first-choice').val();
		var item = $('#deleteItem').val();
		Meteor.call('deleteItem',itemType, item, function(error,result) {
				if (error)
					return alert(error.reason); 
			});
	},
	
});

$(document).ready(function() {
	$('.button-check').on(function(){
		console.log('please delete this email recipient');		
	})

	
	
	
});



