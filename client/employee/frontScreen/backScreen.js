Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');


Template.backScreen.events({
  "click #swapBTN": function( evt, instance ){
    Router.go('/pseudoMenu');
  },
	
	"click #logout": function(evt, instance){
		Meteor.call("delLocalByUser");
		Meteor.logout();
		Router.go("/#l")
	},
});

Template.readyInfo.helpers({
  'ready' : function(){
 	 return ReadyOrders.find().fetch().reverse();
  }
});

Template.ready1.helpers({
  'readyName' : function(){
    return this.uName;
  }
});

Template.orderPrice.helpers({
	'price' : function(){
		var orNum = this.orderNum; 
		
		if(this.uName === "nick" || this.uName === "clairevf" || this.uName === "emma")
		{
			return "Paid in house";
		}
		
		if(this.inHouse){
			return "Paid in house";
		}
		if(this.price == 0.00){
			return "Paid with order " + orNum;
		}
		
		
		var price = parseFloat((this.price)); 
		return "$" + price.toFixed(2); 
		
		
	}
});



Template.cellNum.helpers({
  'cellNum' : function(){
	  if(!this.inHouse){
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
	  return ' ';
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
    var orNum = this.orderNum;
	var usrID = this.userId; 
    var orders = ReadyOrders.find({orderNum: orNum}).fetch();
    var cellNumber = this.cellNumber;
    var inhaus = this.inHouse;
    var delID = this._id; 
	var start = this.start; 
	var finish = this.finish;
    var str = this.item;
	var flavors = this.flavor; 
	var mixins = this.mixin; 
    var totalP = this.price;
	var dnum = this.dnum;
    Meteor.call('pickUpOrder', str, flavors, mixins, start, finish, delID, orNum, inhaus, totalP, usrID, cellNumber, dnum, function(error,result) {
				if (error)
					return alert(error.reason);
			}); 
  } 
});

