Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');
Meteor.subscribe('local');



Template.pseudoMenu.helpers({
  'bagel': function(){
    return Bagels.find().fetch();
  }
});


Template.pseudoMenu.rendered = function(){
    var num = Local.find({uName: "bsnemp"}).count(); 
 	var type = window.location.hash.substr(1);
    if (type === "m"){
  	window.history.pushState("", "", '/pseudoMenu');
		if(num > 0){	
	  	  $('#atcBTN').prop('disabled', false); //TO ENABLE
	  	  $('#atcBTN').fadeTo(0,1);
	  	  $('#atcBTN').css("cursor", "pointer");
		}else{					
	  	  $('#atcBTN').prop('disabled', true); //TO DISABLED
	  	  $('#atcBTN').fadeTo(0,.4);
	  	  $('#atcBTN').css("cursor", "default");
		}
	}else{
		if(num > 1){	
	  	  $('#atcBTN').prop('disabled', false); //TO ENABLE
	  	  $('#atcBTN').fadeTo(0,1);
	  	  $('#atcBTN').css("cursor", "pointer");
		}else{					
	  	  $('#atcBTN').prop('disabled', true); //TO DISABLED
	  	  $('#atcBTN').fadeTo(0,.4);
	  	  $('#atcBTN').css("cursor", "default");
		}
	}
};

Template.pseudoMenu.events({
  'click': function(evt, instance){ // get all clicks
	  countBev = 0;
	  countBag = 0;
	  countSnack = 0;
	  
	  countF = 0;
	  countM = 0;

	$.each($('#flavList').serializeArray(),function() {
	  countF++;
	});

	$.each($('#mixList').serializeArray(),function(){
	  countM++;
	});

	$.each($('#sizeList').serializeArray(),function(){
	  countS++;
	});
	  
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
	
	if(countBev > 0 || countBag > 0 || countSnack > 0 || ((countF > 0 && countF < 3) && (countM < 3))){
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
		var form1 = {};
  		var price1 = {};
		$.each($('#snackList').serializeArray(),function() {
			form1[this.name] = this.name;
			price1[this.name] = this.value;
		});
		for (var key in form1) {
			Meteor.call('snackOrder',form1[key], price1[key], function(error,result) {
				if (error)
					return alert(error.reason);
			});
		}
		
		/* =============== bev Orders =============== */
		var form2 = {};
		var price2 = {};
		$.each($('#bevList').serializeArray(),function() {
			form2[this.name] = this.name;
    	    price2[this.name] = this.value;
		});

		for (key in form2) {
			Meteor.call('bevOrder',form2[key], price2[key], function(error,result) {
				if (error)
					return alert(error.reason);
			});
		}
		/* =============== bagel Orders =============== */
		
		var form3 = {};
		var price3 = {};
    	var count = 0;
		$.each($('#bagelList').serializeArray(),function() {
			form3[this.name] = this.name;
     		price3[this.name] = this.value;
		}); 
    
		for (key in form3) {
			Meteor.call('bagelOrder',form3[key], price3[key], function(error,result) {
				if (error)
					return alert(error.reason);
			});
		}
		/* =============== shake orders ==================*/
	    var flavForm = {};
		var mixForm = {};
		var boolOrder = false; 
		var size;
	
	    $.each($('#flavList').serializeArray(),function(){
			flavForm[this.name] = this.name;
			console.log("flavor: " + flavForm);
			boolOrder = true; 
	    });
	    var flavStr = ""
	    for (var shit in flavForm){
	      flavStr = flavStr + flavForm[shit] + ", ";
	    }
		flavStr = flavStr.substring(0, flavStr.length - 2);
	    
	
	    $.each($('#mixList').serializeArray(),function(){
	      mixForm[this.name] = this.name;
	    });
	    var mixinStr = ""
	    for (var shit in mixForm){
	      mixinStr = mixinStr + mixForm[shit] + ", ";
	    }
		mixinStr = mixinStr.substring(0, mixinStr.length - 2);
		
		console.log("Bool order: " + boolOrder);
		if(boolOrder){
			console.log("placing a shake order");
			Meteor.call('shakeOrder', flavStr, mixinStr, function(error,result) {
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



