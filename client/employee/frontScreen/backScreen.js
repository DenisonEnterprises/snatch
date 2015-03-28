Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');


Template.backScreen.events({
  "click #swapBTN": function( evt, instance ){
    Router.go('/pseudoMenu');
  },
});

Template.readyInfo.helpers({
  'ready' : function(){
 	 console.log("I found a ready! Actually, I found: " + ReadyOrders.find().fetch());
 	 return ReadyOrders.find().fetch();
  }
});

Template.ready1.helpers({
  'readyName' : function(){
    return this.uName;
  }
});

Template.orderPrice.helpers({
	'price' : function(){
		console.log("This is: " + this);
		return this.price;
	}
});

Template.cellNum.helpers({
  'cellNum' : function(){
    	console.log("This template is not a little bitch -- 2");

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

/*
 Template.ready3.helpers({
  'readyTime' : function(){
    var time = this.submitted; 
    return time.getHours() + ":" + time.getMinutes() + "." + time.getSeconds();
  }
});*/

Template.orderNum.helpers({
  'orderNum' : function(){
    return this.orderNum;
  }
});


Template.readyInfo.helpers({
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
    var inhaus = this.inHouse;
    
    var str = "";
    for (i=0; i < orders.length; i++) {
      console.log(orders[i].item);
      str = str + orders[i].item + "\n";
	 
      total = total + orders.price; 
    }
    Meteor.call('pickUpOrder', str, orNum, inhaus, total, usr, cellNumber, function(error,result) {
				if (error)
					return alert(error.reason);
			}); 
  } 
});

