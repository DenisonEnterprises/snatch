Template.pseudoCheck.helpers({
  
  'order': function() {
    //if prevents error due to ordering of page loading, etc.
    if (Meteor.user()) {
      var user = Meteor.user();
      return Local.find({userId: user._id});
    }
  }
  
});

Template.pseudoCheck.events({
  
  'click #placeOrder': function() {
    var orders = Local.find({userId: Meteor.user()._id}).fetch();
    var str = "";
    var temp = "";
    var total = 0; 
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
		Meteor.call('placeOrder', str, total, Meteor.user(), function(error,result) {
			if (error)
				return alert(error.reason);
		}); 
		Router.go('/pseudoTYC'); 
	}
   
  },
  
  'click #deleteOrder': function() {
    var delID = this._id;
    Meteor.call('deleteOrder', delID,  Meteor.user(), function(error,result) {
		if (error)
			return alert(error.reason);
	});  
    if(Local.find({userId: Meteor.user()._id}).count() < 2){
      console.log("Deleted all the items in the order");
      Router.go('/pseudoMenu');
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
      Router.go('pseudoMenu');
   },
  
  
  
});