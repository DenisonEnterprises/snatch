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
});


Template.bagels.rendered = function(){
	$('#itemNum').on('input', function(){ 
		count = 0; 
		var place = 0; 
		$.each($('#bagel_list').serializeArray(),function() {
			numItems = $("#itemNum").text();
			place++;
			//console.log(this.name, ':', numItems);	 
			if(numItems > 0){
				count += numItems;
			}
		});
		//console.log('count: ', count);
		if(count === 0){
			$('#atcButton').prop('disabled', true); //TO DISABLED
			$('#atcButton').fadeTo(0,.4);
			$('#atcButton').css("cursor", "default");
		}else{
			$('#atcButton').prop('disabled', false); //TO ENABLE
			$('#atcButton').fadeTo(0,1);
			$('#atcButton').css("cursor", "pointer");
		}
	});
}


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
	var form = {};
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






