Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');

Template.orderList.events({
  "click #swapBTN": function(evt, instance ){
    Router.go('employee');
  },
});



Template.itemInfo.helpers({
	'CheesePizzaNum' : function(){
		var j = 0;			// number of cheese pizza bagels
		var itemDeets;		// array for the items to fall into
		ActiveOrders.find().forEach(function(order){ itemDeets = order.item.split('\n'); 
		for(index = 0; index < itemDeets.length; index++){
			if(itemDeets[index] == 'Pizza Bagel (Cheese) '){
				j++;
			}
		}
		});
		return j;
	},
	
	'pepPizzaNum' : function(){ 
		var j = 0;			// number of pepperoni pizza bagels
		var itemDeets;		// array for the items to fall into
		ActiveOrders.find().forEach(function(order){ itemDeets = order.item.split('\n'); 
		for(index = 0; index < itemDeets.length; index++){
			if(itemDeets[index] == 'Pizza Bagel (Pep) '){
				j++;
			}
		}
		});
		return j;	},
	
	'snagelNum' : function(){
		var j = 0;			// number of snagels
		var itemDeets;		// array for the items to fall into
		ActiveOrders.find().forEach(function(order){ itemDeets = order.item.split('\n'); 
		for(index = 0; index < itemDeets.length; index++){
			if(itemDeets[index] == 'Snagel '){
				j++;
			}
		}
		});
		return j;	},
	
	'onShakes' : function(){
		var j = 0;			// number of oreo nutella milkshakes
		var itemDeets;		// array for the items to fall into
		var oreo; 		// bool value for milkshake with oreos
		ActiveOrders.find().forEach(function(order){ itemDeets = order.item.split('\n'); 
		for(index = 0; index < itemDeets.length; index++){
			console.log(itemDeets[index]);
			if(itemDeets[index] == "Shake: "){
				j++;
			}
		}
		});
		return j;	}	
});


/*
Things to do: 
	- parse the items at the '\n' 
	- count how many time pizza bagel shows up
*/