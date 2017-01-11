Meteor.subscribe('instance');
Meteor.subscribe('emailList');
Meteor.subscribe('kitchenCap');


Template.manager.rendered = function(){
	var app = Instance.findOne({name: "bandersnatch"}); 
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
	'topping': function(){
		return Milkshakes.find({type: "topping"}).fetch(); 
	},
	'flavor': function(){
		return Milkshakes.find({type:'flavor'}).fetch();
	},
	'recip': function(){
		return EmailList.find({}).fetch(); 
	},
	
	'kitchenCap': function(){
		var maxCap = KitchenCap.findOne({name:'bandersnatch'}); //findOne({name:'cap'});
		return maxCap.capNum;
	},
});

Template.emailChain.helpers({
	'indvEmail':function(){
		return this.email; 
	}, 

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


	'submit #chngCap': function(evt){
		var cn = $('#capNum').val(); 
		Meteor.call('changeCap', cn);
	},
	
	
	'click #addRecip': function(evt){
		var emailz = $('#recieveEmail').val(); 
		$('#recieveEmail').val('')
		Meteor.call('addToEmailList', emailz, function(error,result) {
				if (error)
					return alert(error.reason); 
			});
	},
	
	'click #addNewItem': function(evt){
		var itemType = $("#itemType").val(); 
		if(itemType === "select"){
			return;
		}
		var itemName = $($("#itemTitle")).val();
		if(itemName === ""){
			return;
		}
		var itemPrice = parseFloat($($("#dollar")).val() + "." + $($("#cents")).val()); 
		Meteor.call('addNewItem',itemType, itemName, itemPrice, function(error,result) {
				if (error)
					return alert(error.reason); 
			});
			
			document.getElementById('notifAdded').style.opacity='1.0';
			document.getElementById('notifAdded').style.visibility='visible';

  	setTimeout(function(){
        $('#notifAdded').animate({ opacity: 0 }, 1000, 'linear')
  	}, 3000);
	},
	
	'click .delEmail':function(evt){
		Meteor.call('delEmail', this.email, function(error, result){
			if(error)
				return alert(error.reason);
		});
	},

	'click #delThis': function(evt){
		var itemType = $('#first-choice').val();
		var item = $('#deleteItem').val();
		Meteor.call('deleteItem',itemType, item, function(error,result) {
				if (error)
					return alert(error.reason); 
			});
			
			document.getElementById('notifDeleted').style.opacity='1.0';
			document.getElementById('notifDeleted').style.visibility='visible';

  	setTimeout(function(){
        $('#notifDeleted').animate({ opacity: 0 }, 1000, 'linear')
  	}, 3000);
	},
	
	"click #logout": function(evt, instance){
		Meteor.logout();
		Router.go("/#l");
	},
	
});



