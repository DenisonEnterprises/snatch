Template.checkout.helpers({
  
  'order': function() {
    //if prevents error due to ordering of page loading, etc.
    if (Meteor.user()) {
      var user = Meteor.user();
      return Local.find({userId: user._id});
    }
  }
  
});

Template.checkout.events({
  
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
		console.log("first final is: " + final);
		while(final.length < 3){
		  console.log("Edited final: " + final);
		  final += "0";
		}
		console.log("about to call place order...  screen should be changing soon");
		Meteor.call('placeOrder', str, total, Meteor.user(), function(error,result) {
					if (error)
						return alert(error.reason);
				}); 
		Router.go('/thankYouCheckout'); 
	}
   
  },
  
  'click #deleteOrder': function() {
    var delOrder = this.item;
    var price = this.value; 
    Meteor.call('deleteOrder', delOrder, price,  Meteor.user(), function(error,result) {
				if (error)
					return alert(error.reason);
			});  
    console.log(Local.find().count());
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
  
  
  
});