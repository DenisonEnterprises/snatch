Meteor.methods({
		
    makeStudent: function () {
        Roles.setUserRoles(this.userId, 'student');
    },

	remo: function() {
		Meteor.users.remove({_id: this.userId});
	},
	
	uName: function(newName) {
		Meteor.users.update({_id: this.userId}, {$set:{username: newName}} ); 
	},
	
	delLocalByUser: function() {
		Local.remove({userId: this.userId});
	},

  placeOrder: function(thing, shakes, price, inHouse, usr) {
    var orNum = ActiveOrders.find().count() + ReadyOrders.find().count() + FinishedOrders.find().count() + 1;
    var order = {
      userId: usr._id,
      inHouse: inHouse,
      uName: usr.username,
      item: thing,
		shakes: shakes,
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
  
  
  
  
  employeePlaceOrder: function(thing, shakes, price, inHouse, usr, apple) {
    var orNum = ActiveOrders.find().count() + ReadyOrders.find().count() + FinishedOrders.find().count() + 1;
    var order = {
      userId: usr._id,
      inHouse: inHouse,
      uName: apple,
      item: thing,
		shakes: shakes,
      submitted: new Date(),
      orderNum: orNum,
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
  	
  delOrder: function(orderId){
	  ActiveOrders.remove({_id: orderId});
  },
	
    deleteActiveOrder: function(delID){
  		Local.remove({_id: delID}); 
  		return 0;
  	}, 
  	
  	uName: function(newName) {
		Meteor.users.update({_id: this.userId}, {$set:{username: newName}} ); 
	},
  	
	delLocalByUser: function() {
		Local.remove({userId: this.userId});
	},

 	rm: function() {
		Local.remove({_id: this.userId});
 	},

  
  // Employee has finished making an order
  finishedOrder: function(thing, delID, price, inHouse, orNum, usr, cellNum, cellCarrier){
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
    ReadyOrders.insert(order);
    ActiveOrders.remove({_id: delID});
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
  
  employeeFinishedOrder: function(thing, delID, price, inHouse, apple, orNum, usr, cellNum, cellCarrier, shakes){
    var order = {
      userId: usr._id,
      inHouse: inHouse,
      uName: apple,
      item: thing,
      submitted: new Date(),
      orderNum: orNum,
      phone: cellNum,
      carrier: cellCarrier,
      user: usr,
      price: price, 
		shakes: shakes,
    };
    ReadyOrders.insert(order);
    ActiveOrders.remove({_id: delID});
	return 0;
	},
  
  pickUpOrder: function(thing, delID, orNum, inHouse, price, usr, cellNum){
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
	console.log("PRICE: " + price);
    FinishedOrders.insert(order);
    ReadyOrders.remove({_id: delID});  
    
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


 
  shakeOrder: function(flavors, mixins) {
     var user = Meteor.user();
     var str =  "Shake: ";
     var order = {
 	  type: "shake",
       userId: user._id,
 	  flavor: flavors,
 	  mixin: mixins,
       uName: user.username,
       price: "$3.00",
       item: str,
       submitted: new Date(),        
     }
     Local.insert(order);
   },
   
   appOff: function() {
	   
		Instance.update({
		  name: "bandersnatch"
		}, {
		  $set: {status: "off"}
		});
	},
   
   appOn: function() {
	Instance.update({
	  name: "bandersnatch"
	}, {
	  $set: {status: "on"}
	});
   },
  
   sendEmail: function(){
	   console.log("send email");
	   
	   var totOrders = FinishedOrders.find().fetch();
	   var price = 0.0;
	   var indvPrice = "";
	   var text = "";
	   var late = ""; 
	   for(var i = 0; i < totOrders.length; i++){
		   price += parseFloat(totOrders[i].price);
		
	   } 
	   text += "total revenue of the night: $" + price + "\n";
	   
	   var latePPL = ReadyOrders.find().fetch(); 
	   for(i = 0; i < latePPL.length; i++){
		   late += latePPL[i].uName + ", ";
	   }
	   text += "List of people who didn't pick up Order: " + late + "\n";
	   	   
	   Email.send({
         from: "bandersnatchApp@gmail.com",
         to: "costa_n1@denison.edu",

         subject: "Daily Stats",
         text: text, //Still Need to Implement
       });
	   
   },
 
   pushFinished: function(){
	   var finished = FinishedOrders.find().fetch(); 
	   for(var order in finished){
		   Data.insert(order);
	   }
	   FinishedOrders.remove({});
	   ReadyOrders.remove({});
   },
   
   
   
  /*
  createAct: function() {
      var bsUser = Meteor.users.findOne({username: "bsnemp2"}); 
      Roles.createRole('employee2');
	  Roles.setUserRoles(bsUser, 'employee2');
	  
      var bsUser1 = Meteor.users.findOne({username: "bsnemp"}); 
      Roles.createRole('employee');
	  Roles.setUserRoles(bsUser1, 'employee');
	
      var mana = Meteor.users.findOne({username: "bsnman"}); 
      //Roles.createRole('manager');
      Roles.setUserRoles(mana, 'manager');
  }*/
  
  
  
});