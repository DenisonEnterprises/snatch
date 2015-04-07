Meteor.subscribe('local');
Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');



Template.PseudoShake.helpers({
	'mixins' : function(){
		return this.mixin;
	}
	
});

Template.PseudoShake.helpers({
	'flavors' : function(){
		return this.flavor; 
	}
	
});

Template.PseudoShake.helpers({
	'shake': function(){
		console.log("SHAKE: " + this.item);
		return this.item;
	}
});

Template.PseudoShake.helpers({
	'price' : function(){
		return this.price; 
	}
});

Template.PseudoShake.helpers({
	'shakey' : function(){
		return this.item == "Shake: ";
	}
	
});

Template.pseudoCheck.rendered = function() {
	$('#appleName').on('input', function(){
		var input=$(this).val();
	    var button = document.getElementById("placeOrder");
		
		if(input.length > 0){
	        $("#placeOrder").css("cursor", "pointer");
	        button.disabled = false;
	        button.style.opacity = "1.0";
	        button.style.filter  = 'alpha(opacity=100)'; // IE fallback
		}else{
			//disable
	        $("#cout").css("cursor", "none");
	        button.disabled = true;
	        button.style.opacity = "0.4";
	        button.style.filter  = 'alpha(opacity=40)'; // IE fallback
		}
	});

}


Template.pseudoCheck.helpers({
    'order': function() {
      //if prevents error due to ordering of page loading, etc.
      if (Meteor.user()) {
        var user = Meteor.user();
  	    console.log("NUM OF ITEMS: " + Local.find({userId: user._id}).count());
        /*if(Local.find({userId: Meteor.user()._id}).count() == 0){
      	  Router.go('/pseudoMenu');
    	 }*/
		 
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
	var flavor = "";
	var mixin = "";
    
 	var apple=$($('#appleName')).val();

	
		for (i=0; i < orders.length; i++) {
			var indvPrice = "";
			indvPrice = (orders[i].price)[1] + (orders[i].price)[2] + (orders[i].price)[3] + (orders[i].price)[4];
			temp = indvPrice; 
			if(orders[i].item == "Shake: "){
				flavor = orders[i].flavor;
				mixin = orders[i].mixin;
			}
		  str = str + orders[i].item + "\n";
		  total = total + parseFloat(temp);
		}
		total = total.toFixed(2);
		console.log("CALL");
		Meteor.call('employeePlaceOrder', str, flavor, mixin, total, true, Meteor.user(), apple, function(error,result) {
			if (error)
				return alert(error.reason + "FUCK");
		}); 
		Router.go('/pseudoMenu'); 
	
   
  },
  
  'click #deleteOrder': function() {
    var delID = this._id;
    Meteor.call('deleteActiveOrder', delID,  Meteor.user(), function(error,result) {
		if (error)
			return alert(error.reason);
	});  
    if(Local.find({userId: Meteor.user()._id}).count() < 2){
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