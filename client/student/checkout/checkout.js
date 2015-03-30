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

Template.totalPrice.helpers({
	'totPrice': function(){
		var orders = Local.find({userId: Meteor.user()._id}).fetch();
		var tp = 0; 
		var temp = ""; 
		var indvPrice = "";
		for(var i = 0; i < orders.length; i++){
			tp += parseFloat((orders[i].price).slice(1)); 
		}
		return "$" + tp.toFixed(2);
	}
});

Template.orNum.helpers({
	'orderNum' : function() {
		return ActiveOrders.find().count();
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
	  
		  str = str + orders[i].item + "\n";
		  total = total + parseFloat(temp);
		}

		total = total.toFixed(2);
		
		Meteor.call('placeOrder', str, total, false, Meteor.user(), function(error,result) {
			if (error)
				return alert(error.reason);
		}); 
		Router.go('/thankYouCheckout'); 	
	}
   
  },
  
  'click #deleteOrder': function() {
	  
	  
      var delOrder = this._id;
      Meteor.call('deleteActiveOrder', delOrder, function(error,result) {
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