Meteor.subscribe('beverages');


Template.beverages.events({
  "click #bagelBTN": function( evt, instance ){
    Router.go('bagels');
  },
  
  "click #shakesBTN": function( evt, instance){
    Router.go('shakes');
  },
    "click #snackBTN": function( evt, instance ){
    Router.go('snacks');
  },
    "click #backBTN": function(evt, instance ){
    Router.go('menu');
  },
    "click #logout": function(ev, instance){
		Meteor.call("delLocalByUser");
		Meteor.logout();
		window.location.assign("/");
  },
  "click #bev_list": function(evt, instance){ //gets all clicks
	  count = 0;
	  $.each($('#bev_list').serializeArray(),function() {
			count++
	  });
	  
	  if(count === 0){
		  $('#atcButton').prop('disabled', true); //TO DISABLED
		  $('#atcButton').fadeTo(0,.4);
		  $('#atcButton').css("cursor", "default");
	  }else{
		  $('#atcButton').prop('disabled', false); //TO ENABLE
		  $('#atcButton').fadeTo(0,1);
		  $('#atcButton').css("cursor", "pointer");
	  }
  	
   },
  
});


Template.beverages.helpers({
  
  'bev': function(){
    return Beverages.find().fetch();
  }
});

Template.beverages.events({

	'submit form': function(event) {
		event.preventDefault();

		var form = {};
    var price;
		$.each($('#bev_list').serializeArray(),function() {
			form[this.name] = this.name;
      price = this.value;
		});

		for (var key in form) {
			Meteor.call('bevOrder',form[key], price, function(error,result) {
				if (error)
					return alert(error.reason);
			});
		}
		Router.go('/menu#u')
	}
})


Template.bevBox.helpers({
  'bevName': function(){
    return this.type;
  }
});


Template.bevBox.helpers({
  'bevPrice': function(){
     return "$" + this.price.toFixed(2);
  }
});