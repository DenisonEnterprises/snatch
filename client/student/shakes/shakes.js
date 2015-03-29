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
  
  
  
  "click #small": function(evt, instance){
  	price = "$2.50";
	
	//Meteor.call("createAct");
  
	
  },
  "click #reg": function(evt, instance){
  	price = "$3.00";
  },
  
  
  "click": function(evt, instance){ //gets all clicks
	  countF = 0;
	  countM = 0;
	  countS = 0;
	  $.each($('#flavor_list').serializeArray(),function() {
		  countF++;
	  });
	  
	  $.each($('#mixin_list').serializeArray(),function(){
		  countM++;
	  });
	  
	  $.each($('#size_list').serializeArray(),function(){
	  	  countS++;
	  });
	  if(countF === 0 || countF > 2 || countM > 3 || countS === 0){
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
    var flavor;
    var form = {};
	var size; 
  	
    $.each($('#flavor_list').serializeArray(),function(){
		flavor = this.name + "\n";
		if(this.price == "2.50"){
			size = "Small"; 
		}else{
			size = "Regular";
		}
    });
    $.each($('#mixin_list').serializeArray(),function(){
      form[this.name] = this.name;
/*      if(price == NULL){
      		price = "$" + this.value;
      }*/
    });
    var mixinStr = ""
    for (var shit in form){
      mixinStr = mixinStr + form[shit] + "\n";
      }
    
      Meteor.call('shakeOrder',mixinStr, flavor, price, size, function(error,result) {
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



