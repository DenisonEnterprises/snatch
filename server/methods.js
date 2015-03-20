Meteor.methods({
		
    makeStudent: function () {
        Roles.setUserRoles(this.userId, 'student');
    },

	rm: function() {
		console.log("REMOVE USER");
		Meteor.users.remove({_id: this.userId});
	},
	
	uName: function(newName) {
		Meteor.users.update({_id: this.userId}, {$set:{username: newName}} ); 
	},
	
	delLocalByUser: function() {
		Local.remove({userId: this.userId});
	},

  placeOrder: function(thing, price, inHouse, usr) {
    var orNum = ActiveOrders.find().count() + ReadyOrders.find().count() + FinishedOrders.find().count() + 1;
    var order = {
      userId: usr._id,
      inHouse: inHouse,
      uName: usr.username,
      item: thing,
      submitted: new Date(),
      orderNum: orNum,
      phone: usr.profile.cellNumber,
      carrier: usr.profile.cellCarrier,
      user: usr,
      price: price,
      
    };
    ActiveOrders.insert(order);
    Local.remove({userId: usr._id});

    return 0;
  },   
  
 // Delete order from the checkout menu
  
	deleteOrder: function(delID) {
		Local.remove({userId: delID});
		return 0;
	},   
  
  deleteCHKOrder: function(delItem){
  		Local.remove({item: delItem});
  		return 1;
  },
  
    deleteActiveOrder: function(delID, user){
  		Local.remove({_id: delID}); 
  		return 0;
  	}, 
  	
  deleteActiveOrder: function(delID, user){
  		ActiveOrders.remove({_id: delID});
  		return 0;
    },
  
  	uName: function(newName) {
		Meteor.users.update({_id: this.userId}, {$set:{username: newName}} ); 
	},
  	
	delLocalByUser: function() {
		Local.remove({userId: this.userId});
	},

 	rm: function() {
-		Local.remove({_id: this.userId});
 	},

  
  // Employee has finished making an order
  finishedOrder: function(thing, price, inHouse, orNum, usr, cellNum, cellCarrier){
    var order = {
      userId: usr._id,
      inHouse: inHouse,
      uName: usr.username,
      fName: usr.firstName,
      lname: usr.lastName,
      item: thing,
      submitted: new Date(),
      orderNum: orNum,
      phone: cellNum,
      carrier: cellCarrier,
      user: usr,
      price: price, 
    };
    console.log("about to insert " + thing);
    ReadyOrders.insert(order);
    console.log("about to remove order with number: " + orNum);
    ActiveOrders.remove({orderNum: orNum});
    console.log("process is finished");
    /*
    var msg = ""; 
    var cellPhone = order.phone.toString(); 
    var cellCar = order.carrier.toString(); 
    if(cellCar === "verizon"){
      msg = cellPhone + "@vtext.com";
    }
    else if(cellCar === "att"){
      msg = cellPhone + "@txt.att.net";
    }
    else if(cellCar === "alltel"){
      msg = cellPhone + "@sms.alltelwireless.com";
    }
    else if(cellCar === "boostMobile"){
      msg = cellPhone + "@myboostmobile.com";
    }
    else if(cellCar === "cell1"){
      msg = cellPhone + "@mobile.celloneusa.com";
    }
    else if(cellCar === "sprint"){
      msg = cellPhone + "@messaging.sprintpcs.com";
    }
    else if(cellCar === "tMobile"){
      msg = cellPhone + "@tmomail.net";
    }   
    else if(cellCar === "virginMobile"){
      msg = cellPhone + "@vmobl.com";
    }    
    else if(cellCar === "nTelos"){
      msg = cellPhone + "@pcs.ntelos.com";
    }
         
    Email.send({
      from: "bandersnatchApp@gmail.com",
      to: msg,

      //subject: "Your order is ready!",
      text: "Your order is ready!",
    });*/
   
    return 0;
  },
  
  pickUpOrder: function(thing, orNum, inHouse, price, usr, cellNum){
    var order = {
      userId: usr._id,
      inHouse: inHouse,
      uName: usr.username,
      fName: usr.firstName,
      lname: usr.lastName,
      item: thing,
      submitted: new Date(),
      orderNum: orNum,
      cellNumber: cellNum,
      user: usr,
      price: price,
    };
    FinishedOrders.insert(order);
    ReadyOrders.remove({orderNum: orNum});  
    
    return 0;
  },  
  
    // Food Insert Methods
  	bagelOrder: function(bagel, price) {
		var user = Meteor.user();
		var order = {
			userId: user._id,
      itemType: "bagel",
      uName: user.username,
      price: price,
			item: bagel,
			submitted: new Date()
		};
		Local.insert(order);
		return 0;
	},
  
  bevOrder: function(bev, price) {
    var user = Meteor.user();
    var order = {
      userId: user._id,
      itemType: "bev",
      uName: user.username,
      price: price,
      item: bev,
      submitted: new Date()
    };
    Local.insert(order);
  },
  
    snackOrder: function(snack, price) {
    var user = Meteor.user();
    var order = {
      userId: user._id,
      itemType: "snack",
      uName: user.username,
      price: price,
      item: snack,
      submitted: new Date()
    };
    Local.insert(order);
  },

 shakeOrder: function(mixins, flavor, price) {
    var user = Meteor.user();
    var str = "Shake: ";
    var order = {
      userId: user._id,
      uName: user.username,
      price: price,
      item: str + flavor + " " + mixins,
      submitted: new Date(),        
    }
    Local.insert(order);
  },
  
});