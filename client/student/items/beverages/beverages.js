Meteor.subscribe('beverages');


Template.beverages.events({
  "click #bagelBTN": function( evt, instance ){
    Router.go('bagels');
  },
  
  "click #shakesBTN": function( evt, instance){
    Router.go('shakes');
  },
    "click #snackBTN": function( evt, instance ){
    Router.go('snacks');
  },
    "click #backBTN": function(evt, instance ){
    Router.go('menu');
  },
    "click #logout": function(ev, instance){
		Meteor.call("delLocalByUser");
		Meteor.logout();
		window.location.assign("/");
  },
  "click #bev_list": function(evt, instance){ //gets all clicks
	  count = 0;
	  $.each($('#bev_list').serializeArray(),function() {
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


Template.beverages.helpers({
  'bev': function(){
    return Beverages.find().fetch();
  }
});

Template.beverages.events({
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
				Meteor.call('bevOrder', nom, price, totItems, function(error,result) {
								if (error)
									return alert(error.reason);
							});
			}
		}
	   Router.go('/menu#u');
	}
});


Template.bevBox.helpers({
  'bevName': function(){
    return this.name;
  }
});


Template.bevBox.helpers({
  'bevPrice': function(){
     return "$" + this.price.toFixed(2);
  }
});

Template.beverages.helpers({
    appOn:function(){
		var app = Instance.findOne({name: "bandersnatch"}); 
		if(app.status == "on"){
			return true;
		}else{
			return false;
		}

    }
});
