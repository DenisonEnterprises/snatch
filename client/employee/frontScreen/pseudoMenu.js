Meteor.subscribe('pseudoMenu');

Template.pseudoMenu.helpers({
  'bagel': function(){
    return Bagels.find().fetch();
  }
});

Template.pseudoMenu.events({
  'click': function(count){
     return this.value; 
  },
  
  "click #swapBTN": function( evt, instance ){
    Router.go('backScreen');
  },
  
  
});
  
  
/* ------------------------ bagels shit ------------------------ */  
    
Template.pseudoMenu.events({
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

/* ------------------------ beverage shit ------------------------ */

Template.pseudoMenu.helpers({
  
  'bev': function(){
    return Beverages.find().fetch();
  }
});

Template.pseudoMenu.events({

	'submit form': function(event) {
		event.preventDefault();

		var form = {};
    var price;
		$.each($('#bev_list').serializeArray(),function() {
			form[this.name] = this.name;
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


/* ------------------------ snacks shit ------------------------ */


Template.pseudoMenu.helpers({
  
  'snack': function(){
    return Snacks.find().fetch();
  }
});

Template.pseudoMenu.events({

	'submit form': function(event) {
		event.preventDefault();

		var form = {};
  		var price;
		$.each($('#snack_list').serializeArray(),function() {
		form[this.name] = this.name;
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

/* ------------------------ flavor in a shake shit ------------------------ */



Template.pseudoMenu.helpers({
  
  'flavor': function(){
    return Milkshakes.find({type: 'flavor'}).fetch();
  },
  
  'mixin': function(){
    return Milkshakes.find({type: 'mixin'}).fetch();
  }, 
  
});

Template.pseudoMenu.events({
  
  'submit form': function(event) {
    event.preventDefault();
    var flavor;
    var form = {};
    var price; 
    
    $.each($('#flavor_list').serializeArray(),function(){
      flavor = this.name + "\n";
      price = "$" + this.value;
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
    
      Meteor.call('shakeOrder',mixinStr, flavor, price,function(error,result) {
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

Template.flavorBox.events({
    'click': (function(event) {
      var elements = document.getElementsByName('flavor');
      var i = 0; 
      while (i < 3 && elements[i].checked){
        if(elements[i].checked){
          console.log("checkmate");
        }
        i = i+1;
      }
      /*
      for (var i = 0, l = 3 ; i < l ; i++) {
       // console.log("Congrats on a fucking flavor");
        if (elements[i].checked) {
          //console.log("Congrats on a fucking flavor"); 
        }
      }*/
  }),
});


Template.mixinBox.events({
    'click': function(event) {
      var elements = document.getElementsByName('mixin');
      for (var i = 0,l=4;i<l;i++) {
        if (elements[i].checked) {
        }
      }
  },
});


