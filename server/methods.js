Meteor.methods({
    makeStudent: function () {
        Roles.setUserRoles(this.userId, 'student');
    },

  placeOrder: function(thing, price, usr) {
    var orNum = ActiveOrders.find().count() + ReadyOrders.find().count() + FinishedOrders.find().count() + 1;
    var order = {
      userId: usr._id,
      uName: usr.username,
      fName: usr.profile.firstName,
      lName: usr.profile.lastName,
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
  
    deleteOrder: function(thing, price, usr) {
    var order = {
      userId: usr._id,
      uName: usr.username,
      fName: usr.firstName,
      lname: usr.lastName,
      item: thing,
      submitted: new Date(),
      phone: usr.profile.cellNumber,
      carrier: usr.profile.cellCarrier,
      user: usr,
      price: price, 
    };
    Local.remove({item: thing});


    return 0;
  },   
  

  // Employee has finished making an order
  finishedOrder: function(thing, price, orNum, usr, cellNum, cellCarrier){
    var order = {
      userId: usr._id,
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
    
    ReadyOrders.insert(order);
    ActiveOrders.remove({orderNum: orNum});
    
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
    });
   
    return 0;
  },
  
  pickUpOrder: function(thing, orNum, price, usr, cellNum){
    var order = {
      userId: usr._id,
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
      item: str + "\n" + flavor + " " + mixins,
      submitted: new Date(),        
    }
    Local.insert(order);
  },
  
});