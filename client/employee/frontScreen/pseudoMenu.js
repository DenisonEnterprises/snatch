Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');

Template.pseudoMenu.helpers({
  'bagel': function(){
    return Bagels.find().fetch();
  }
});

Template.pseudoMenu.events({
  'click': function(evt, instance){ // get all clicks
	  countBev = 0;
	  countBag = 0;
	  countSnack = 0;
	  
	  countFlav = 0;
	  countMix = 0;
	  countSize = 0;
	  
	$.each($('#snackList').serializeArray(),function() {
		countSnack++;
	});
	
	$.each($('#bevList').serializeArray(),function() {
		countBev++;
	});
	
	$.each($('#bagelList').serializeArray(),function() {
		countBag++;
	}); 
	
	//LOGIC FOR SHAKES!!!!!
	
	if(countBev > 0 || countBag > 0 || countSnack > 0){
	  $('#atcBTN').prop('disabled', false); //TO ENABLE
	  $('#atcBTN').fadeTo(0,1);
	  $('#atcBTN').css("cursor", "pointer");
	}else{
	  $('#atcBTN').prop('disabled', true); //TO DISABLED
	  $('#atcBTN').fadeTo(0,.4);
	  $('#atcBTN').css("cursor", "default");
	}
	
  },
  
  "click #swapBTN": function( evt, instance ){
    Router.go('backScreen');
  },
  
  'click #atcBTN' : function(evt, instance){
 	 /* =============== snack Orders =============== */
  		event.preventDefault();
		var form = {};
  		var price;
		$.each($('#snackList').serializeArray(),function() {
			form[this.name] = this.name;
			price = this.value;
		});
		for (var key in form) {
			Meteor.call('snackOrder',form[key], price, function(error,result) {
				if (error)
					return alert(error.reason);
			});
		}
		
		/* =============== bev Orders =============== */
		var form2 = {};
		$.each($('#bevList').serializeArray(),function() {
			form2[this.name] = this.name;
    	    price = this.value;
		});

		for (key in form2) {
			Meteor.call('bevOrder',form2[key], price, function(error,result) {
				if (error)
					return alert(error.reason);
			});
		}
		/* =============== bagel Orders =============== */
		
		var form3 = {};
    	var count = 0;
		$.each($('#bagelList').serializeArray(),function() {
			form3[this.name] = this.name;
     		price = this.value;
		}); 
    
		for (key in form3) {
			Meteor.call('bagelOrder',form3[key], price, function(error,result) {
				if (error)
					return alert(error.reason);
			});
		}
		
		
		
		Router.go('pseudoCheck');
	}
  	
});
  
  
/* ------------------------ bagels shit ------------------------ */  

Template.pbagelBox.helpers({
  'bagelName': function(){
    return this.type;
  }
});

Template.pbagelBox.helpers({
  'bagelPrice': function(){
     return "$" + this.price.toFixed(2);
  }
});

/* ------------------------ beverage shit ------------------------ */

Template.pseudoMenu.helpers({
  
  'bev': function(){
    return Beverages.find().fetch();
  }
});


Template.pbevBox.helpers({
  'bevName': function(){
    return this.type;
  }
});



Template.pbevBox.helpers({
  'bevPrice': function(){
     return "$" + this.price.toFixed(2);
  }
});


/* ------------------------ snacks shit ------------------------ */


Template.pseudoMenu.helpers({
  
  'snack': function(){
    return Snacks.find().fetch();
  }
});


Template.psnackBox.helpers({

  'snackName': function(){
    return this.type;
  }
      
});


Template.psnackBox.helpers({

  'snackPrice': function(){
    return "$" + this.price.toFixed(2);
  }
      
});

/* ------------------------ flavor in a shake shit ------------------------ */



Template.pseudoMenu.helpers({
  
  'flavor': function(){
    return Milkshakes.find({type: 'flavor'}).fetch();
  },
  
  'mixin': function(){
    return Milkshakes.find({type: 'mixin'}).fetch();
  }, 
  
});
    

Template.pflavorBox.helpers({
  'flavorName': function(){
    return this.name;
  }
});

Template.pmixinBox.helpers({
  'mixinName': function(){
    return this.name;
  }
});



