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
  }
});

Template.order3.helpers({
  'orderTime' : function(){
    var time = this.submitted;
	
	if(time.getHours() > 12){
	    return (time.getHours() - 12) + ":" + ("0" + time.getMinutes()).slice(-2) + " PM"; //PM
	}else{
	    return time.getHours() + ":" + ("0" + time.getMinutes()).slice(-2) + " AM"; //AM
	}
  }
});


Template.order2.helpers({
  'orderDeets' : function(){
    return this.item; 
  }
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
 
  'click #finished': function() {
    var total = 0; 
    var orNum = this.orderNum;
    var orders = ActiveOrders.find({orderNum: orNum}).fetch(); 
    var usr = this.user;
    var cellNumber = this.phone;
    var cellCarrier = this.carrier;
    var inhaus = this.inHouse;
    var str = "";
    for (i=0; i < orders.length; i++) {
      str = str + orders[i].item + "\n";
      total = total + orders[i].price;
    }
    var delID = this._id; 
  //  console.log("about to call finishedOrder");
    Meteor.call('finishedOrder', str, delID, total, inhaus, orNum, usr, cellNumber, cellCarrier, function(error,result) {
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

