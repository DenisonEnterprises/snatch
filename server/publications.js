//Publish things from here so they can be made available client-side

Meteor.publish('bagels', function(){
	return Bagels.find();
});