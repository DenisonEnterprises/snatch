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
		j = ActiveOrders.find({item: 'Pizza Bagel (Cheese) '}).count();
		return j;
	},
	
	'pepPizzaNum' : function(){ 
		var j = 0;			// number of pepperoni pizza bagels
		j = ActiveOrders.find({item: 'Pizza Bagel (Pepperoni) '}).count()
		return j;
	},
	
	'snagelNum' : function(){
		var j = 0;			// number of snagels
		j = ActiveOrders.find({item: "Snagel "}).count(); 
		return j;
	},
	
	'onShakes' : function(){
		var j = 0;			// number of oreo nutella milkshakes
		j = ActiveOrders.find({item: "Shake:  \n"}).count(); 		
		return j;	
	}
});

/*
Things to do: 
	- parse the items at the '\n' 
	- count how many time pizza bagel shows up
*/