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

		if(this.inHouse){
			return "PAID";
		}else{
			var price = parseFloat((this.price).slice(1)); 
			return "$" + price.toFixed(2); 
		}
		
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


Template.orderNum.helpers({
  'orderNum' : function(){
    return this.orderNum;
  }
});


Template.item.helpers({	
	'item' : function(){
		return this.item;
	}
});

Template.addIns.helpers({
    'info': function() {
		console.log('finding info');
		var str = "";
		var len = this.shakes.length;
		var i;
		if(this.item == 'Shake: '){
			console.log('we found a shake!');
		}
		for(i = 0; i < len; i++){
			str += (i+1) + ". " + this.shakes[i].flavor + "\n" + this.shakes[i].mixin + "\n";
		}
  	  return str;
    },
  
	
});

Template.readyInfo.events({
 
  'click #pickUp': function() {
    var total = 0.0; 
    var orNum = this.orderNum;
    var orders = ReadyOrders.find({orderNum: orNum}).fetch();
    var usr = this.user;
    var cellNumber = this.cellNumber;
    var inhaus = this.inHouse;
    var delID = this._id; 
    var str = "";
    for (i=0; i < orders.length; i++) {
      str = str + orders[i].item;
	 
      total = total + orders[i].price; 
    }
	console.log("Price: " + total);
    Meteor.call('pickUpOrder', str, delID, orNum, inhaus, total, usr, cellNumber, function(error,result) {
				if (error)
					return alert(error.reason);
			}); 
  } 
});

