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
    return time.getHours() + ":" + time.getMinutes() + "." + time.getSeconds();
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
    console.log('first total is: ' + total);
    for (i=0; i < orders.length; i++) {
      str = str + orders[i].item + "\n";
      total = total + orders[i].price;
      console.log('orders.price: ' + orders.price);
      console.log('updated total is: ' + total);
    }
    
  //  console.log("about to call finishedOrder");
    console.log('the total price is: ' + total);
    Meteor.call('finishedOrder', str, total, inhaus, orNum, usr, cellNumber, cellCarrier, function(error,result) {
		if (error)
			return alert(error.reason);
	}); 
  },
  
  'click #deleBTN': function(){
      var delID = this._id;
      Meteor.call('deleteActiveOrder', delID,  Meteor.user(), function(error,result) {
		if (error)
			return alert(error.reason);
      });  
  },

});

