Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');

Template.employee.events({
  'click #swapBTN': function( evt, instance ){
    Router.go('orderList');
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
    var time = this.submitted;
	
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
  },
});

Template.addIn.helpers({
    'info': function() {
		var str = '';
		var i = 0;
		if(this.flavor != null){
			str = '\n\t' + this.flavor
			if(this.mixin != ''){
				str += "\n\t" + this.mixin;
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
		var order = this.item;
		if(order === "Shake: "){
			flavs = this.flavor; 
			mixins = this.mixin; 
		}
		var usrName = this.uName; 
		var cellNumber = this.phone;
		var cellCarrier = this.carrier;
		var inhaus = this.inHouse;
		var total = this.price; 
		var delID = this._id; 
	    Meteor.call('finishedOrder', order, flavs, mixins, delID, total, inhaus, orNum, userID, usrName, cellNumber, cellCarrier, function(error,result) {
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



