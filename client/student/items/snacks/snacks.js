Meteor.subscribe('snacks');


Template.snacks.events({
  "click #bagelBTN": function( evt, instance ){
    Router.go('bagels');
  },
  
  "click #shakesBTN": function( evt, instance){
    Router.go('shakes');
  },
    "click #backBTN": function( evt, instance ){
    Router.go('menu');
  },
    "click #bevsBTN": function(evt, instance ){
    Router.go('beverages');
  },
  	"click #logout": function(ev, instance){
  	Meteor.logout();
  	Router.go('/');
  	}
  
});



Template.snacks.helpers({
  
  'snack': function(){
    return Snacks.find().fetch();
  }
});

Template.snacks.events({

	'submit form': function(event) {
		event.preventDefault();

		var form = {};
  		var price;
		$.each($('#snack_list').serializeArray(),function() {
		form[this.name] = this.name  + "\n";
    	price = this.value;
		});
		for (var key in form) {
			console.log('ordering');
			Meteor.call('snackOrder',form[key], price, function(error,result) {
				if (error)
					return alert(error.reason);
			});
		}
		Router.go('/menu#u')


	}
})


Template.snackBox.helpers({

  'snackName': function(){
    return this.type;
  }
      
});


Template.snackBox.helpers({

  'snackPrice': function(){
    return "$" + this.price.toFixed(2);
  }
      
});