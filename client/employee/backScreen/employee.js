Meteor.subscribe('employee');

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

Template.orderNum.helpers({
  'orderNum' : function(){
    return this.orderNum;
    
  }
});

Template.cellNum.helpers({
  'cellNum' : function(){
    return this.phone;
  }
});

Template.fName.helpers({
  'firstName' : function(){
    return this.fName;
  }
});

Template.lName.helpers({
  'lastName' : function(){
    return this.lName;
  }
});

Template.readyInfo.helpers({
  'ready' : function(){
  return ReadyOrders.find().fetch();
  }
});

Template.ready3.helpers({
  'readyTime' : function(){
    var time = this.submitted; 
    return time.getHours() + ":" + time.getMinutes() + "." + time.getSeconds();
  }
});

Template.ready2.helpers({
  'readyDeets' : function(){
    console.log(this);
    return this.item;
  }
});

Template.ready1.helpers({
  'readyName' : function(){
    return this.uName;
  }
});

Template.itemPrice.helpers({
  'price' : function(){
    return "$" + this.price;
  }
});



Template.orderInfo.events({
 
  'click #finished': function() {
    var total; 
    var orNum = this.orderNum;
    var orders = ActiveOrders.find({orderNum: orNum}).fetch(); 
    var usr = this.user;
    console.log("USR is " + usr);
    var cellNumber = this.phone;
    console.log("CellNumber is " + cellNumber);
    var cellCarrier = this.carrier;
    console.log("cellCarrier is " + cellCarrier);
    
    
    var str = "";
    for (i=0; i < orders.length - 1; i++) {
      console.log(orders[i].item);
      str = str + orders[i].item + "\n";
      total = total + orders.price;
    }
   // var lastItem = orders.length; 
    //str = str + orders[lastItem].item; 
    Meteor.call('finishedOrder', str, total, orNum, usr, cellNumber, cellCarrier, function(error,result) {
				if (error)
					return alert(error.reason);
			}); 
  }
});





