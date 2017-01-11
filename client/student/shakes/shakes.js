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
		Router.go("/#l")
  },
 
  
  
  'change #flavorList': function(evt, instance){ //gets all clicks
	  countF = false;
	  var flav1 = $('.flavList1').val(); 
	  if(flav1 != "None"){
		  countF = true; 
	  }
	  if(countF){
		  $('#atcButton').prop('disabled', false); //TO ENABLE
		  $('#atcButton').fadeTo(0,1);
		  $('#atcButton').css("cursor", "pointer");
		  
		  $('.flavList2').show();
	  }else{
		  $('#atcButton').prop('disabled', true); //TO DISABLED
		  $('#atcButton').fadeTo(0,.4);
		  $('#atcButton').css("cursor", "default");
		  
		  $('.flavList2').hide();  
	  }
   },
   
   'change #mixinList': function(evt, instance){ //gets all clicks
 	  var mix1 = $('.mixList1').val(); 
 	  if(mix1 != "None"){
 		  $('.mixList2').show();
 	  }else{
 		  $('.mixList2').hide();  
 	  }
    },

		'change #toppingList': function(evt, instance){ //gets all clicks
	   	  var top1 = $('.toppingList1').val(); 
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
  },

	'topping': function(){
	  return Milkshakes.find({type: 'topping'}).fetch();
	}, 

	'toppingName': function(){
	  return this.name;
	}
  
});



Template.shakes.events({

	'click #atcButton': function(event) {
		event.preventDefault();
		var nom = ''; 
		var price = 3; 
		var mixStr = '';
		var flav1 = $('.flavList1 option:selected').val(); 
		var flav2 = $('.flavList2 option:selected').val();
		var mix1 = $('.mixList1 option:selected').val(); 
		var mix2 = $('.mixList2 option:selected').val(); 
		var top1 = $('.toppingList1 option:selected').val();

		var flavStr = flav1; 
		if(flav2 != 'None'){
			flavStr += ', ' + flav2 + '\n'; 
		}

		if(mix1 != 'None'){
			mixStr += mix1;

			var mk = Milkshakes.find().fetch(); 
			var m = 0;
			while(mk[m].name != mix1){
				m++;
			}
			var mp1 = mk[m].price;
			if(mp1 != undefined) {
			price=price+mp1} 
		}
		if(mix2 != 'None'){
			mixStr += ', ' + mix2 + '\n';
			
			var mk2 = Milkshakes.find().fetch(); 
			var n = 0;
			while(mk2[n].name != mix2){
				n++;
			}
			var mp2 = mk2[n].price;
			if(mp2 != undefined) {
			price=price+mp2}
		}

		if(top1 != 'None') {
			var topStr = top1;

			var tp = Milkshakes.find().fetch(); 
			var t = 0;
			while(tp[t].name != top1){
				t++;
			}
			var tp1 = tp[t].price;
			if(tp1 != undefined) {
			price=price+tp1} 
		}

		Meteor.call('shakeOrder', flavStr, mixStr, topStr, price, function(error,result) {
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


