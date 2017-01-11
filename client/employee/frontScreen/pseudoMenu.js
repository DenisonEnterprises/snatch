Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');
Meteor.subscribe('local');



Template.pseudoMenu.helpers({  
	'bagel': function(){
		return Bagels.find().fetch();
	},
	
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


Template.pseudoMenu.rendered = function(){
    var num = Local.find({uName: "bsnemp"}).count(); 
 	var type = window.location.hash.substr(1);
    if (type === "m"){
  	window.history.pushState("", "", '/pseudoMenu');
		if(num > 0){	
	  	  $('#atcBTN').prop('disabled', false); //TO ENABLE
	  	  $('#atcBTN').fadeTo(0,1);
	  	  $('#atcBTN').css("cursor", "pointer");
		}else{					
	  	  $('#atcBTN').prop('disabled', true); //TO DISABLED
	  	  $('#atcBTN').fadeTo(0,.4);
	  	  $('#atcBTN').css("cursor", "default");
		}
	}else{
		if(num > 1){	
	  	  $('#atcBTN').prop('disabled', false); //TO ENABLE
	  	  $('#atcBTN').fadeTo(0,1);
	  	  $('#atcBTN').css("cursor", "pointer");
		}else{					
	  	  $('#atcBTN').prop('disabled', true); //TO DISABLED
	  	  $('#atcBTN').fadeTo(0,.4);
	  	  $('#atcBTN').css("cursor", "default");
		}
	}
};

Template.pseudoMenu.events({
	
	
	"change #itemNum": function(event) {
		var count = 0;
		var itemNums = []
		itemNums = $(event.currentTarget).val();
		var sel = document.getElementsByName('itemNum'); 
		for(var i = 0; i < sel.length; i++){
			if(sel[i].selectedIndex > 0){
				count += sel[i].selectedIndex;
			}
		}
		
		
		if(count === 0){
			$('#atcBTN').prop('disabled', true); //TO DISABLED
			$('#atcBTN').fadeTo(0,.4);
			$('#atcBTN').css("cursor", "default");
		}else{
			$('#atcBTN').prop('disabled', false); //TO ENABLE
			$('#atcBTN').fadeTo(0,1);
			$('#atcBTN').css("cursor", "pointer");
		}
  
	},
  
    'change #flavorList': function(evt, instance){ //gets all clicks
		  var countF = false;
		  var flav1 = $('.flavList1').val(); 
		  if(flav1 != "None"){
			  countF = true; 
		  }
		  if(countF){
			  $('#atcBTN').prop('disabled', false); //TO ENABLE
			  $('#atcBTN').fadeTo(0,1);
			  $('#atcBTN').css("cursor", "pointer");
	  
			  $('.flavList2').show();
		  }else{
			  $('#atcBTN').prop('disabled', true); //TO DISABLED
			  $('#atcBTN').fadeTo(0,.4);
			  $('#atcBTN').css("cursor", "default");
	  
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
  
  "click #swapBTN": function( evt, instance ){
    Router.go('backScreen');
  },
  
  "click #atcBTN" : function(evt, instance){
	    
   		event.preventDefault();
   		var nom = ''; 
   		var totItems = 0; 
		var bag;
   	    var price = 0; 
   		var sel = document.getElementsByName('itemNum'); 
   		for(var i = 0; i < sel.length; i++){
			var type = sel[i].title;
   			if(sel[i].selectedIndex > 0){
   				nom = sel[i].className; 
				totItems = sel[i].selectedIndex;
				if(type === 'bagel'){
					if(nom ==="Half and"){
						nom = 'Half and Half';
					}
					bags = Bagels.find().fetch();
					var j = 0;
					var bagLen = Bagels.find().count(); 
					while(bags[j].name != nom && j < bagLen){
						j++;
					}
					price = bags[j].price;
	   				Meteor.call('bagelOrder', nom, price, totItems, function(error,result) {
	   					if (error)
	   						return alert(error.reason);
	   				});
				}else if(type === 'snack'){
					sn = Snacks.find().fetch(); 
					var j = 0;
					while(sn[j].name != nom){
						j++;
					}
					price = sn[j].price;					
	   				Meteor.call('snackOrder', nom, price, totItems, function(error,result) {
	   					if (error)
	   						return alert(error.reason);
	   				});
				}else if(type === 'bev'){
					bev = Beverages.find().fetch();
					var j = 0;
					while(bev[j].name != nom){
						j++;
					}					
					price = bev[j].price;
	   				Meteor.call('bevOrder', nom, price, totItems, function(error,result) {
	   					if (error)
	   						return alert(error.reason);
	   				});
				}
   			}
   		}

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

		if(flav1 != "None"){
			Meteor.call('shakeOrder', flavStr, mixStr, topStr, price, function(error,result) {
				if (error)
						return alert(error.reason);
			});
		}
		Router.go('/pseudoCheck');
	},

});
  
/* ------------------------ bagels shit ------------------------ */  

Template.pbagelBox.helpers({	
	'bagelName': function(){
		return this.name;
	},

	'bagelPrice': function(){
		return this.price; 
	}
});


/* ------------------------ beverage shit ------------------------ */

Template.pseudoMenu.helpers({
  
  'bev': function(){
    return Beverages.find().fetch();
  }
});


Template.pbevBox.helpers({
  'bevName': function(){
    return this.name;
  }
});




/* ------------------------ snacks shit ------------------------ */


Template.pseudoMenu.helpers({
  
  'snack': function(){
    return Snacks.find().fetch();
  }
});


Template.psnackBox.helpers({

  'snackName': function(){
    return this.name;
  }
      
});



/* ------------------------ flavor in a shake shit ------------------------ */



Template.pseudoMenu.helpers({
  
  'flavor': function(){
    return Milkshakes.find({type: 'flavor'}).fetch();
  },
  
  'mixin': function(){
    return Milkshakes.find({type: 'mixin'}).fetch();
  }, 
  
});
    


