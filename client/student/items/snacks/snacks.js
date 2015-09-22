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
});



Template.snacks.helpers({
  'snack': function(){
    return Snacks.find().fetch();
  }
});

Template.snacks.events({

	"change #itemNum": function(event) {
		//console.log("Value: " + $(event.currentTarget).val() );
		var itemNums = []
		itemNums = $(event.currentTarget).val();
		var count = 0;
		var sel = document.getElementsByName('itemNum'); 

		for(var i = 0; i < sel.length; i++){
			if(sel[i].selectedIndex > 0){
				count += sel[i].selectedIndex;
			}
		}

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
	
	'submit form': function(event) {
		event.preventDefault();
		var nom = ''; 
		var totItems = 0; 
	    var price = 0; 
		
		var sel = document.getElementsByName('itemNum'); 
		for(var i = 0; i < sel.length; i++){
			if(sel[i].selectedIndex > 0){
				nom = sel[i].className; 
				price = ((sel[i].title).slice(1));
				totItems = sel[i].selectedIndex;
				console.log(nom + ' ' + price + ' : ' + totItems);
				Meteor.call('snackOrder', nom, price, totItems, function(error,result) {
								if (error)
									return alert(error.reason);
							});
			}
		}
	   Router.go('/menu#u');
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
