Meteor.subscribe('thankYouCheckout');


Template.thankYouCheckout.events({
	'click #thanks': function() {
		console.log('CLICKED!!!');
      	console.log("roles is: " + Meteor.user().roles);
      	console.log("hi friends");
      	
      	if(Meteor.user().roles == "student"){
      	  window.location.href = '/menu';
      	}else{
      		window.location.href = '/backScreen';
      	}
      }

});