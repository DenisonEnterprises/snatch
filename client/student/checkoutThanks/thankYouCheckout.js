Meteor.subscribe('thankYouCheckout');


Template.thankYouCheckout.events({
	'click #thanks': function() {
      	if(Meteor.user().roles == "student"){
      	  window.location.href = '/menu';
      	}else{
      		window.location.href = '/backScreen';
      	}
      }

});