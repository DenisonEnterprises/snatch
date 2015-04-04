Meteor.subscribe('milkshakes');
Template.shakes.events({
  "click #bagelBTN": function( evt, instance ){
    Router.go('bagels');
  },
  
  "click #snackBTN": function( evt, instance){
    Router.go('snacks');
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
 
  
  
  "click": function(evt, instance){ //gets all clicks
	  countF = 0;
	  countM = 0;
	 
	  $.each($('#flavor_list').serializeArray(),function() {
		  countF++;
	  });
	  
	  $.each($('#mixin_list').serializeArray(),function(){
		  countM++;
	  });

	  if(countF === 0 || countF > 2 || countM > 3 ){
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


Template.shakes.helpers({
  
  'flavor': function(){
    return Milkshakes.find({type: 'flavor'}).fetch();
  },
  
  'mixin': function(){
    return Milkshakes.find({type: 'mixin'}).fetch();
  }, 
  
});



Template.shakes.events({

  'submit form': function(event) {
    event.preventDefault();
    var flavForm = {};
	var mixForm = {};
	var size;
	
    $.each($('#flavor_list').serializeArray(),function(){
		flavForm[this.name] = this.name;
    });
    var flavStr = "";
    for (var shit in flavForm){
      flavStr = flavStr + flavForm[shit] + ", ";
    }
	flavStr = flavStr.substring(0, flavStr.length - 2);
	
    $.each($('#mixin_list').serializeArray(),function(){
      mixForm[this.name] = this.name;
    });
    var mixinStr = ""
    for (var shit in mixForm){
      mixinStr = mixinStr + mixForm[shit] + ", ";
    }
	mixinStr = mixinStr.substring(0, mixinStr.length - 2);
	
	Meteor.call('shakeOrder', flavStr, mixinStr, function(error,result) {
		if (error)
		  return alert(error.reason);
	});
	
	
    Router.go('/menu#u');
  }
});

Template.flavorBox.helpers({
  'flavorName': function(){
    return this.name;
  }
});

Template.mixinBox.helpers({
  'mixinName': function(){
    return this.name;
  }
});



