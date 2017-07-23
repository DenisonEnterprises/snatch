Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');

Template.employee.events({
  'click #swapBTN': function( evt, instance ){
    Router.go('orderList');
  },
  
  'click #refresh': function( evt, instance ){
    //Router.go('employee');
	document.location.reload(true);
  },
	
	"click #logout": function(evt, instance){
		Meteor.call("delLocalByUser");
		Meteor.logout();
		Router.go("/#l")
	},
});



Template.orderInfo.helpers({
  'order' : function(){
    return ActiveOrders.find().fetch();
  },
  
  'shakey' : function() {
	  return this.item == "Shake: ";
  },
});


Template.order3.helpers({
  'orderTime' : function(){
    var time = this.start;	
	if(time.getHours() >= 12 && time.getHours() < 24){
	    if(time.getHours() == 12){
			return '12' + ":" + ("0" + time.getMinutes()).slice(-2) + " PM"; //PM
	    }else{
			return (time.getHours() - 12) + ":" + ("0" + time.getMinutes()).slice(-2) + " PM"; //PM
	    }
		
	}else{
		if(time.getHours() == 0){
	    	return '12' + ":" + ("0" + time.getMinutes()).slice(-2) + " AM"; //AM
		}else{
	    	return time.getHours() + ":" + ("0" + time.getMinutes()).slice(-2) + " AM"; //AM
		}
	}
  }
});


Template.order2.helpers({
  'orderDeets' : function(){
    return this.item;
	//return this.comment; 
  },
});

Template.comm.helpers({
  'comments' : function(){
	  return "\n"+this.comment;
  },
});

Template.addIn.helpers({
    'info': function() {
		var str = '';
		var i = 0;
		if(this.flavor != null){
			str = '\n\t' + this.flavor;
			if((this.mixin != '')&&(this.mixin != null)){
				str += "\n\t" + this.mixin;
			}
		if((this.topping != '')&&(this.topping != null)){
				str += "\n\t" + this.topping;
			}
		}
  	  return str;
    },
  
});


Template.order1.helpers({
  'userName' : function(){
    return this.uName;
  }
});

Template.inHaus.helpers({
	'inHaus' : function(){
		if(this.inHouse){
			return "Yes";
		}
		else{
			return "No";
		}
	}
	
});

Template.orderNum.helpers({
  'orderNum' : function(){
    return this.orderNum;
  }
});

Template.orderInfo.events({
 
	'click #finished': function(evt) {
		var userID = this.userId;
		var orNum = this.orderNum;
		var flavs = ''; 
		var mixins = '';
		var toppings = ''; 
		var order = this.item;
		if(order === "Shake: "){
			flavs = this.flavor; 
			mixins = this.mixin; 
			toppings = this.topping;
		}
		var usrName = this.uName; 
		var cellNumber = this.phone;
		var cellCarrier = this.carrier;
		var inhaus = this.inHouse;
		var total = this.price; 
		var delID = this._id; 
		var start = this.start;
		var email = this.email;
		var dnum = this.dnum;
		
		$('#finished').prop('disabled', true); //TO DISABLED
		$('#finished').fadeTo(0,.4);
		$('#finished').css("cursor", "default");
		
		console.log(email);
	    Meteor.call('finishedOrder', order, start, flavs, mixins, toppings, delID, total, inhaus, orNum, userID, usrName, email ,cellNumber, cellCarrier, dnum, function(error,result) {
			if (error)
				return alert(error.reason);
			}); 
	},
  
  'click #deleBTN': function(){
      var delID = this._id;
      Meteor.call('delOrder', delID, function(error,result) {
		if (error)
			return alert(error.reason);
      });  
  },

});



