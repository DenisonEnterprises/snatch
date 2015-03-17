Template.bagels.events({
  "click #backBTN": function( evt, instance ){
    Router.go('menu');
  },
  
  "click #shakesBTN": function( evt, instance){
    Router.go('shakes');
  },
    "click #snackBTN": function( evt, instance ){
    Router.go('snacks');
  },
    "click #bevsBTN": function(evt, instance ){
    Router.go('beverages');
  },
    "click #logout": function(ev, instance){
  	Meteor.logout();
  	Router.go('/');
  },
  
});





Template.bagels.helpers({
  'bagel': function(){
    return Bagels.find().fetch();
  }
});

Template.bagels.events({
  'click': function(count){
     return this.value; 
  }
});
    
Template.bagels.events({
	'submit form': function(event) {
		event.preventDefault();

		var form = {};
 	   var price; 
	    var count = 0
		$.each($('#bagel_list').serializeArray(),function() {
			form[this.name] = this.name;
      price = this.value;

		}); 
    
		for (var key in form) {
			Meteor.call('bagelOrder',form[key], price, function(error,result) {
				if (error)
					return alert(error.reason);
			});
		}
    
    Router.go('/menu#u');
  }
});

Template.bagelBox.helpers({
  'bagelName': function(){
    return this.type;
  }
});

Template.bagelBox.helpers({
  'bagelPrice': function(){
     return "$" + this.price.toFixed(2);
  }
});




