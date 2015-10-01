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
	"change #itemNum": function(event) {
		var count = 0;
		var itemNums = []
		itemNums = $(event.currentTarget).val();
		var sel = document.getElementsByName('itemNum'); 
		for(var i = 0; i < sel.length; i++){
			if(sel[i].selectedIndex > 0){
				count += sel[i].selectedIndex;
			}
		}

		if(count === 0){
			$('#atcBTN').prop('disabled', true); //TO DISABLED
			$('#atcBTN').fadeTo(0,.4);
			$('#atcBTN').css("cursor", "default");
		}else{
			$('#atcBTN').prop('disabled', false); //TO ENABLE
			$('#atcBTN').fadeTo(0,1);
			$('#atcBTN').css("cursor", "pointer");
		}
  
	},
  
  
  "click #swapBTN": function( evt, instance ){
    Router.go('backScreen');
  },
  
  "click #atcBTN" : function(evt, instance){
	    
   		event.preventDefault();
   		var nom = ''; 
   		var totItems = 0; 
		var bag;
   	    var price = 0; 
   		var sel = document.getElementsByName('itemNum'); 
   		for(var i = 0; i < sel.length; i++){
			var type = sel[i].title;
			console.log('type: ', type);
   			if(sel[i].selectedIndex > 0){
   				nom = sel[i].className; 
				totItems = sel[i].selectedIndex;
				if(type === 'bagel'){
					bag = Bagels.find({name: nom}).fetch();
					price = bag.price;
	   				Meteor.call('bagelOrder', nom, price, totItems, function(error,result) {
	   					if (error)
	   						return alert(error.reason);
	   				});
				}else if(type === 'snack'){
					sn = Snacks.find({name: nom}).fetch(); 
					price = sn.price; 
	   				Meteor.call('snackOrder', nom, price, totItems, function(error,result) {
	   					if (error)
	   						return alert(error.reason);
	   				});
				}else if(type === 'bev'){
					bev = Beverages.find({name: nom}).fetch();
					price = bev.price;
	   				Meteor.call('bevOrder', nom, price, totItems, function(error,result) {
	   					if (error)
	   						return alert(error.reason);
	   				});
				}
   			}
   		}

   	   Router.go('/pseudoCheck');
	},

});
  
/* ------------------------ bagels shit ------------------------ */  

Template.pbagelBox.helpers({
  'bagelName': function(){
    return this.name;
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
    return this.name;
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
    return this.name;
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



