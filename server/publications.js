//Publish things from here so they can be made available client-side

Meteor.publish('users' , function(){ //change so it only publishes the current user
	return Meteor.users.find();
});

Meteor.publish('bagels', function(){
	return Bagels.find();
});

Meteor.publish('snacks', function(){
	return Snacks.find();
});

Meteor.publish('beverages', function(){
	return Beverages.find();
});

Meteor.publish('milkshakes', function(){
	return Milkshakes.find();	
});

Meteor.publish('local', function(){
	return Local.find();
});

//Roles??
//Local

