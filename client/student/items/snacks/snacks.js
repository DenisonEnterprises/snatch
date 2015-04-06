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
		Meteor.call("delLocalByUser");
		Meteor.logout();
		window.location.assign("/");
  	},
	
    "click #snack_list": function(evt, instance){ //gets all clicks
  	  count = 0;
  	  $.each($('#snack_list').serializeArray(),function() {
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



Template.snacks.helpers({
  
  'snack': function(){
    return Snacks.find().fetch();
  }
});

Template.snacks.events({

	'submit form': function(event) {
		event.preventDefault();
		var price = {};
		var form = {};
  		var price;
		$.each($('#snack_list').serializeArray(),function() {
			form[this.name] = this.name;
	    	price[this.name] = this.value;
		});
		for (var key in form) {
			console.log('ordering');
			Meteor.call('snackOrder',form[key], price[key], function(error,result) {
				if (error)
					return alert(error.reason);
			});
		}
		Router.go('/menu#u')


	}
});



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



Template.snacks.helpers({
    appOn:function(){
		var app = Instance.findOne({name: "bandersnatch"}); 
		if(app.status == "on"){
			return true;
		}else{
			return false;
		}

    }
});
