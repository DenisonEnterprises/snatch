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

		if(this.inHouse || this.price == 0.00){
			return "PAID";
		}else{
			var price = parseFloat((this.price)); 
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
		var str = '';
		var i = 0;
		if(this.flavor != ''){
			str += '\n\t' + this.flavor
			if(this.mixin != ''){
				str += "\n\t" + this.mixin;
			}
		}
  	  return str;
    },
  
	
});

Template.readyInfo.events({
 
  'click #pickUp': function() {
    var total = 0.0; 
    var orNum = this.orderNum;
    var orders = ReadyOrders.find({orderNum: orNum}).fetch();
    var cellNumber = this.cellNumber;
    var inhaus = this.inHouse;
    var delID = this._id; 
	var start = this.start; 
	var finish = this.finish;
    var str = "";
    for (i=0; i < orders.length; i++) {
      str = str + orders[i].item;
	 
      total = total + orders[i].price; 
    }
    Meteor.call('pickUpOrder', str, start, finish, delID, orNum, inhaus, total, cellNumber, function(error,result) {
				if (error)
					return alert(error.reason);
			}); 
  } 
});

