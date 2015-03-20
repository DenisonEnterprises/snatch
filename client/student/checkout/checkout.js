Meteor.subscribe("local");
Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');

Template.checkout.helpers({
  
  'order': function() {
    //if prevents error due to ordering of page loading, etc.
    if (Meteor.user()) {
      var user = Meteor.user();
      if(Local.find({userId: Meteor.user()._id}).count() == 0){
    	  Router.go('/menu');
  	  }
      return Local.find({userId: user._id});
    }
  }
  
});

Template.checkout.events({
  
  'click #placeOrder': function() {
    var orders = Local.find({userId: Meteor.user()._id}).fetch();
   	var delUN = Meteor.user().username;
    var str = "";
    var temp = "";
    var total = 0; 
	var orNum = ActiveOrders.find().count();
    if(orders.length > 6){			// Cap order size at 5
    	alert("Woah way too many orders. You can only order 5");
    }
    else{
		for (i=0; i < orders.length; i++) {
			var indvPrice = "";
			indvPrice = (orders[i].price)[1] + (orders[i].price)[2] + (orders[i].price)[3] + (orders[i].price)[4];
			temp = indvPrice; 
	  
		  str = str + orders[i].item;
		  total = total + parseFloat(temp);
		}
		var final = total.toString();
		while(final.length < 3){
		  final += "0";
		}
	    if(confirm("There are " + orNum + " order in front of you!\n To delete your order, press 'cancel'")){
			Meteor.call('placeOrder', str, total, false, Meteor.user(), function(error,result) {
				if (error)
					return alert(error.reason);
			}); 
			Router.go('/thankYouCheckout'); 	
		}else{
			console.log("We just lost a customer :(");
			console.log(Meteor.user());
			var delOrders = Local.find({uName: delUN}).fetch();
			for(var i = 0; i < delOrders.length; i++){
				console.log(delOrders[i].item);
				Meteor.call('deleteCHKOrder', delOrders[i].item, function(error,result) {
					console.log("bye-bye order!");
					if (error)
						return alert(error.reason);
				}); 
			}
		}

	}
   
  },
  
  'click #deleteOrder': function() {
    var delID = this._id;
    Meteor.call('deleteOrder', delID, Meteor.user(), function(error,result) {
		if (error)
			return alert(error.reason);
	});  
    if(Local.find({userId: Meteor.user()._id}).count() < 2){
      Router.go('/menu');
    }
  },
  
  
   "click #bagelBTN": function( evt, instance ){
    Router.go('bagels');
  },
  
  "click #shakesBTN": function( evt, instance){
    Router.go('shakes');
  },
    "click #snackBTN": function( evt, instance ){
    Router.go('snacks');
  },
    "click #bevsBTN": function(evt, instance ){
    Router.go('beverages');
  },
   "click #menu": function(evt, instance){
      Router.go('menu');
   },
   
"click #logout": function(evt, instance){
	Meteor.call("delLocalByUser");
	Meteor.logout();
	window.location.assign("/");
},
   

  
  
  
});