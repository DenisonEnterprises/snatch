Meteor.subscribe('backScreen');

Template.backScreen.events({
  "click #swapBTN": function( evt, instance ){
    Router.go('pseudoMenu');
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

Template.orderNum.helpers({
  'orderNum' : function(){
    return this.orderNum;
    
  }
});

Template.cellNum.helpers({
  'cellNum' : function(){
  	var temp;
    var str = this.phone;
    temp = '(';
    for(var i = 0; i < 3; i++){
    	temp = temp + str[i];	
    }
    temp = temp + ')'; 
    for(i = 3; i < 6; i++){
    	temp += str[i]; 
    }
    temp += '-';
    for(i = 6; i < 10; i++){
    	temp += str[i];
    }
    return temp;
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




Template.readyInfo.events({
 
  'click #pickUp': function() {
    var total; 
    var orNum = this.orderNum;
    var orders = ReadyOrders.find({orderNum: orNum}).fetch();
    var usr = this.user;
    var cellNumber = this.cellNumber;
    
    
    var str = "";
    for (i=0; i < orders.length; i++) {
      console.log(orders[i].item);
      str = str + orders[i].item + "\n";
      total = total + orders.price; 
    }
    //var lastItem = orders.length; 
    //str = str + orders[lastItem].item;
    Meteor.call('pickUpOrder', str, orNum, total, usr, cellNumber, function(error,result) {
				if (error)
					return alert(error.reason);
			}); 
  } 
});

