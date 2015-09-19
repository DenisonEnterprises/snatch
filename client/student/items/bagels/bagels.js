Meteor.subscribe('bagels');

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
		Meteor.call("delLocalByUser");
		Meteor.logout();
		window.location.assign("/");
  },
  
  
  "click #bagel_list": function(evt, instance){ //gets all clicks
	  /*count = 0;
	  $.each($('#bagel_list').serializeArray(),function() {
		  count++;
	  });
	  
	  if(count === 0){
		  $('#atcButton').prop('disabled', true); //TO DISABLED
		  $('#atcButton').fadeTo(0,.4);
		  $('#atcButton').css("cursor", "default");
	  }else{*/
		  $('#atcButton').prop('disabled', false); //TO ENABLE
		  $('#atcButton').fadeTo(0,1);
		  $('#atcButton').css("cursor", "pointer");
	//}
  	
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
	/*var form = {};
	var price = {};
	var tot = {};
	var numItems=0; 
    var price; 
    var count = 0;
	$('.bagel').each(function(){
		numItems = parseFloat($(this).val());
		if(numItems >0){
			console.log('Price: ', this.value);
			form[this.name] = this.name; 
			price[this.name] = this.value; 
			tot[this.name] = numItems; 
		}		
	});
	for (var key in form) {
		Meteor.call('bagelOrder',form[key], price[key], tot[key], function(error,result) {
			if (error)
				return alert(error.reason);
		});
	}*/
	
	Meteor.call('bagelOrder', "Pizza Bagel (Peperroni)", "2.00", 2, function(error,result) {
		if (error)
			return alert(error.reason);
	});
	
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

Template.bagels.helpers({
    appOn:function(){
		var app = Instance.findOne({name: "bandersnatch"}); 
		if(app.status == "on"){
			return true;
		}else{
			return false;
		}

    }
});





