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
	  
	  countF = 0;
	  countM = 0;
	  countS = 0;

	$.each($('#flavList').serializeArray(),function() {
	  countF++;
	  console.log(countF);
	});

	$.each($('#mixList').serializeArray(),function(){
	  countM++;
	  console.log(countF);
	});

	$.each($('#sizeList').serializeArray(),function(){
	  countS++;
	  console.log(countS);
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
	
	if(countBev > 0 || countBag > 0 || countSnack > 0 || ((countF > 0 && countF < 3) && (countM < 4) && countS > 0)){
	  $('#atcBTN').prop('disabled', false); //TO ENABLE
	  $('#atcBTN').fadeTo(0,1);
	  $('#atcBTN').css("cursor", "pointer");
	}else{
	  $('#atcBTN').prop('disabled', true); //TO DISABLED
	  $('#atcBTN').fadeTo(0,.4);
	  $('#atcBTN').css("cursor", "default");
	}
	
  },
  
  "click #small": function(evt, instance){
  	price = "$2.50";

	//Meteor.call("createAct");
  },
  "click #reg": function(evt, instance){
  	price = "$3.00";
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
		
		/* =============== shake orders ==================*/
	    var flavor;
	    var form4 = {};
		var size; 
  	
	    $.each($('#flavor_list').serializeArray(),function(){
			flavor = this.name;
			if(this.price == 2.50){
				size = "Small"; 
			}else{
				size = "Regular";
			}
	    });
	    $.each($('#mixin_list').serializeArray(),function(){
	      form4[this.name] = this.name;
	    });
	    var mixinStr = ""
	    for (var shit in form4){
	      mixinStr = mixinStr + form[shit];
	      }
    
	      Meteor.call('shakeOrder',mixinStr, flavor, price, size, function(error,result) {
	        if (error)
	          return alert(error.reason);
	      });
		
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



