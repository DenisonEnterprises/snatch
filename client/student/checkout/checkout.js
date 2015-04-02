Meteor.subscribe("local");
Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');


Template.Shake.helpers({
	'mixins' : function(){
		console.log("MIXIN: " + this.mixin);
		return this.mixin;
	}
	
});

Template.Shake.helpers({
	'flavors' : function(){
		console.log("FLAVOR: " + this.flavor);
		return this.flavor; 
	}
	
});

Template.checkout.helpers({
		'shake': function(){
			  var orders = new Array();
			  var shakeList = new Array();
			  var countS = 0;
			  //if prevents error due to ordering of page loading, etc.
			  if (Meteor.user()) {
				var user = Meteor.user();
				orders = Local.find({userId: user._id, type: "shake"}).fetch();
				console.log(orders);
				return orders;
			  }
		}
});

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
		var orders = Local.find().fetch();
		var total = 0; 
		var indvPrice = "";
		console.log(orders.length + " many orders");
		for (i=0; i < orders.length; i++) {
			if((orders[i].type != "flavor") && (orders[i].type != "mixin")){
				indvPrice = orders[i].price;
				total = total + parseFloat(indvPrice.slice(1));		
			}
		}
		console.log("In totPrice: " + total);
		return "$" + total.toFixed(2);
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
    var total = 0; 
	var orNum = ActiveOrders.find().count();
    if(orders.length > 6){			// Cap order size at 6
		$('#notif').html("Sorry! You can only order up to 6 items!");    
		$('#notif').show();
    }else{
		for (i=0; i < orders.length; i++) {
			var indvPrice = "";
			indvPrice = orders[i].price;
		  str = str + orders[i].item + "\n";
		  total = total + parseFloat(indvPrice.slice(1));
		}

		total = total.toFixed(2);
		console.log("Total price: " + total);
		Meteor.call('placeOrder', str, total, false, Meteor.user(), function(error,result) {
			if (error)
				return alert(error.reason);
		}); 
		$('#notif').hide();
		
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