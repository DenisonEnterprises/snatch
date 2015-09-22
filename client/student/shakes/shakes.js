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
 
  
  
  'change #flavorList': function(evt, instance){ //gets all clicks
	  countF = false;
	  var flav1 = $('.flavList1 option:selected').val(); 
	 // var flav2 = $('.flavList2 option:selected').val();
	//  console.log('flav2: ', flav2);
	  if(flav1){
		  countF = true; 
	  }
	  if(countF){
		  $('#atcButton').prop('disabled', false); //TO ENABLE
		  $('#atcButton').fadeTo(0,1);
		  $('#atcButton').css("cursor", "pointer");
	  }else{
		  $('#atcButton').prop('disabled', true); //TO DISABLED
		  $('#atcButton').fadeTo(0,.4);
		  $('#atcButton').css("cursor", "default");
	  }
   },
});


Template.shakes.helpers({
  
  'flavor': function(){
    return Milkshakes.find({type: 'flavor'}).fetch();
  },
  
  'flavorName': function(){
  	return this.name;
  },
  
  'mixin': function(){
    return Milkshakes.find({type: 'mixin'}).fetch();
  }, 
  
  'mixinName': function(){
    return this.name;
  }
  
});



Template.shakes.events({

	'click #atcButton': function(event) {
		event.preventDefault();
		var nom = ''; 
		var price = 0; 
		var mixStr = '';
		var flav1 = $('.flavList1 option:selected').val(); 
		var flav2 = $('.flavList2 option:selected').val();
		var mix1 = $('.mixList1 option:selected').val(); 
		var mix2 = $('.mixList2 option:selected').val(); 

		var flavStr = flav1; 
		if(flav2 != 'Select a flavor'){
			flavStr += ', ' + flav2 + '\n'; 
		}
		
		if(mix1 != 'Select a mixin'){
			mixStr += mix1; 
		}
		if(mix2 != 'Select a mixin'){
			mixStr += ', ' + mix2 + '\n';
		}
		
		Meteor.call('shakeOrder', flavStr, mixStr, function(error,result) {
			if (error)
					return alert(error.reason);
		});
	
	Router.go('/menu#u');
}
});



Template.shakes.helpers({
    appOn:function(){
		var app = Instance.findOne({name: "bandersnatch"}); 
		if(app.status == "on"){
			return true;
		}else{
			return false;
		}

    }
});


