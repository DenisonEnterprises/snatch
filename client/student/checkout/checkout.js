Meteor.subscribe("local");
Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');


Template.Shake.helpers({
	'mixins' : function(){
		return this.mixin;
	}
	
});

Template.Shake.helpers({
	'flavors' : function(){
		return this.flavor; 
	}
	
});

Template.Shake.helpers({
	'shake': function(){
		return this.item;
	}
});

Template.Shake.helpers({
	'price' : function(){
		return '$'+ (parseFloat(this.price)).toFixed(2); 
	}
});

Template.Shake.helpers({
	'shakey' : function(){
		return this.item == "Shake: ";
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
	    var orders = Local.find({userId: Meteor.user()._id}).fetch();
		var total = 0.0; 
		var indvPrice = "";
		for (i=0; i < orders.length; i++) {
			if((orders[i].type != "flavor") && (orders[i].type != "mixin")){
				indvPrice = orders[i].price;
				//total = total + parseFloat(indvPrice.slice(1));		
				total+= parseFloat(indvPrice); 
				console.log("TOTAL: " + total);
			}
		}
		return "$" + total.toFixed(2);
	}
});

Template.orNum.helpers({
	'orderNum' : function() {
		//var ords = ActiveOrders.find({}, {field: {userId: Meteor.user()._id}}).count();
		//return ords;
		return ActiveOrders.find().count();
	}
});

Template.checkout.events({
 
  'click #placeOrder': function() {
    var orders = Local.find({userId: Meteor.user()._id}).fetch();
   	var delUN = Meteor.user().username;
    var str = "";
	var flavor = ""; 
	var mixin = "";
	var shakeStr = false;
    var total = 0; 
	shakes = [];
	var orNum = ActiveOrders.find().count();
    if(orders.length > 6){			// Cap order size at 6
		$('#notif').html("Sorry! You can only order up to 6 items!");    
		$('#notif').show();
    }else{
		for (i=0; i < orders.length; i++) {
			var indvPrice = "";
			indvPrice = orders[i].price;
			if(orders[i].item == "Shake: "){
				shakes.push(orders[i]);
				shakeStr = true;
			}else{
		  	  str = str + orders[i].item + "\n";
		  	}
		  total = total + parseFloat(indvPrice.slice(1));
		}
		
		if(shakeStr){
			str = str + "Shake: " + "\n";
		}

		total = total.toFixed(2);
		Meteor.call('placeOrder', str, shakes, total, false, Meteor.user(), function(error,result) {
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


Template.checkout.helpers({
    appOn:function(){
		var app = Instance.findOne({name: "bandersnatch"}); 
		if(app.status == "on"){
			return true;
		}else{
			return false;
		}

    }
});
