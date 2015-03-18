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
  	Meteor.logout();
  	Router.go('/');
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
			form[this.name] = this.name + "\n";
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