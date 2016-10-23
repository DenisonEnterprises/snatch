Meteor.subscribe("local");
Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');
Meteor.subscribe('user');


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
				if(orders[i].type = 'shake'){
					total+= parseFloat(indvPrice);
				}
				else{
					total += parseFloat(indvPrice.slice(1));		
				}
				//total+= parseFloat(indvPrice); 
			}
		}
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
	
	var str = '';
	var flavor = ""; 
	var mixin = "";
	var shakeStr = false;
    var total = 0; 
	var comment=$($('#commentName')).val();
	
	shakes = [];
	items = [];
	
    if(orders.length > 6){			// Cap order size at 6
		document.getElementById('notif').style.opacity='1.0'
		document.getElementById('notif').style.visibility='visible'
    	setTimeout(function(){
          $('#notif').animate({ opacity: 0 }, 1000, 'linear')
    	}, 3000); 
    }else{
		for (i=0; i < orders.length; i++) {	// iterate through all the orders
			var indvPrice = "";			
			indvPrice = orders[i].price;
			if(orders[i].item == "Shake: "){
				shakes.push(orders[i]);		
				shakeStr = true;
			}else{
				items.push(orders[i].item);	//push other snatch items into items[]	
		  	}
			total = total + parseFloat(indvPrice);	// add the price to total
		}
		var multiFlag = false; 
		if(shakeStr){
			str += "Shake: \n";
			for(var k = 0; k < shakes.length; k++){
				if(k == 0){
					Meteor.call('placeShakeOrder',multiFlag, shakes[k].flavor, shakes[k].mixin, total, false, Meteor.user(), comment, function(error,result) {
						if (error)
							return alert(error.reason);
					});
				}else{
					multiFlag = true;
					Meteor.call('placeShakeOrder',multiFlag,shakes[k].flavor, shakes[k].mixin, total, false, Meteor.user(), comment, function(error,result) {
						if (error)
							return alert(error.reason);
					});
				}
			} 
		}
		total = total.toFixed(2);
		for(var j = 0; j < items.length; j++){
			if(shakeStr || j > 0){
				multiFlag = true;
				Meteor.call('placeOrder', multiFlag,items[j], total, false, Meteor.user(), comment, function(error,result) {
					if (error)
						return alert(error.reason);
				});  
			}
			else if(j == 0){
				multiFlag = false; 
				Meteor.call('placeOrder', multiFlag, items[j], total, false, Meteor.user(), comment, function(error,result) {
					if (error)
						return alert(error.reason);
				});  
			}

		}		
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
		Router.go('/menu#m');
      }
  },
  
  
	"click #menu": function(evt, instance){
	 	Router.go('menu');
	},
   
	"click #logout": function(evt, instance){
		Meteor.call("delLocalByUser");
		Meteor.logout();
		Router.go("/#l")
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
