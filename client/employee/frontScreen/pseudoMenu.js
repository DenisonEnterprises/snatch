Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');

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
  
  'click #atcBTN' : function(evt, instance){
 	 /* =============== snack Orders =============== */
 	 	console.log("The button has been clicked");
  		event.preventDefault();
		var form = {};
  		var price;
  		console.log('List of all the snacks ordered:');
		$.each($('#snackList').serializeArray(),function() {
			console.log(this.name);
			form[this.name] = this.name;
			price = this.value;
		});
		console.log('Before the for loop');
		for (var key in form) {
			console.log('ordering');
			Meteor.call('snackOrder',form[key], price, function(error,result) {
				if (error)
					return alert(error.reason);
			});
		}
		
		/* =============== bev Orders =============== */
		var form2 = {};
		$.each($('#bevList').serializeArray(),function() {
			form2[this.name] = this.name;
    	    price = this.value;
		});

		for (key in form2) {
			Meteor.call('bevOrder',form2[key], price, function(error,result) {
				if (error)
					return alert(error.reason);
			});
		}
		/* =============== bagel Orders =============== */
		
		var form3 = {};
    	var count = 0;
		$.each($('#bagelList').serializeArray(),function() {
			form3[this.name] = this.name;
     		price = this.value;
		}); 
    
		for (key in form3) {
			Meteor.call('bagelOrder',form3[key], price, function(error,result) {
				if (error)
					return alert(error.reason);
			});
		}
		
		
		
		Router.go('pseudoCheck');
	}
  	
});
  
  
/* ------------------------ bagels shit ------------------------ */  

Template.pbagelBox.helpers({
  'bagelName': function(){
    return this.type;
  }
});

Template.pbagelBox.helpers({
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


Template.pbevBox.helpers({
  'bevName': function(){
    return this.type;
  }
});



Template.pbevBox.helpers({
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


Template.psnackBox.helpers({

  'snackName': function(){
    return this.type;
  }
      
});


Template.psnackBox.helpers({

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
    

Template.pflavorBox.helpers({
  'flavorName': function(){
    return this.name;
  }
});

Template.pmixinBox.helpers({
  'mixinName': function(){
    return this.name;
  }
});

Template.pflavorBox.events({
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


Template.pmixinBox.events({
    'click': function(event) {
      var elements = document.getElementsByName('mixin');
      for (var i = 0,l=4;i<l;i++) {
        if (elements[i].checked) {
        }
      }
  },
});


