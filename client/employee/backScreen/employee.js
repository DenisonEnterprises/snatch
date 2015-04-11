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
		var str = "";
		var len = this.shakes.length;
		var i;
		for(i = 0; i < len; i++){
			str += (i+1) + ". " + this.shakes[i].flavor + "\n     " + this.shakes[i].mixin + "\n\n";
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
	
	  var sh = this.shakes;
	var total = 0; 
    var orNum = this.orderNum;
    var orders = ActiveOrders.find({orderNum: orNum}).fetch(); 
    var usr = this.user;
	var apple = this.uName; 
    var cellNumber = this.phone;
    var cellCarrier = this.carrier;
    var inhaus = this.inHouse;
    var str = "";
    for (i=0; i < orders.length; i++) {
      str = str + orders[i].item + "\n";
      total = total + orders[i].price;
    }
    var delID = this._id; 
    Meteor.call('employeeFinishedOrder', str, delID, total, inhaus, apple, orNum, usr, cellNumber, cellCarrier, sh, function(error,result) {
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



