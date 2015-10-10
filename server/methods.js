Meteor.methods({
	
	resetOrNum: function() {
		orderNum = 0;
	},
	

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
	
    // Food Insert Methods
	bagelOrder: function(bagel, price, totNum) {
		var user = Meteor.user();
		for(var i=0; i < totNum; i++){
			var order = {
				userId: user._id,
				itemType: "bagel",
				uName: user.username,
				price: price,
				item: bagel,
			};
			Local.insert(order);
		}	
		return 0;
	},

	bevOrder: function(bev, price, totNum) {
		var user = Meteor.user();
		for(var i=0; i < totNum; i++){
			var order = {
				userId: user._id,
				itemType: "bev",
				uName: user.username,
				price: price,
				item: bev,
			};
			Local.insert(order);
		}	
		return 0;
	},
  
	snackOrder: function(snack, price, totNum) {
		var user = Meteor.user();
		for(var i=0; i < totNum; i++){
			var order = {
				userId: user._id,
				itemType: "snack",
				uName: user.username,
				price: price,
				item: snack,
			};
			Local.insert(order);
		}	
		return 0;
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
			price: 3,
			item: str,
		}
		Local.insert(order);
		return 0;
	},  


	otherOrder: function(thing, price){
		var user = Meteor.user(); 
		var order = {
			userId: user._id,
			itemType: "other", 
			uName: user.username, 
			price: price,
			item: thing,
		};
		Local.insert(order);
	},
 
    placeShakeOrder: function(multiFlag, flavs, mixins, price, inHouse, usr) {
		if(!multiFlag){
			orderNum++; 			
		}
		var order = {
			userId: usr._id,
			inHouse: inHouse,
			uName: usr.username,
			start: new Date(), 
			finish: 0,
			flavor: flavs,
			mixin: mixins,
			item: "Shake: ",
			orderNum: orderNum,
			phone: usr.profile.cellNumber,
			carrier: usr.profile.cellCarrier,
			price: price,
		};
		ActiveOrders.insert(order);
		Local.remove({userId: usr._id});

		return 0;
    },  

	placeOrder: function(multiFlag, item, price, inHouse, usr) {
		if(!multiFlag){
			orderNum++;
		}
		var order = {
			userId: usr._id,
			inHouse: inHouse,
			uName: usr.username,
			item: item,
			start: new Date(),
			finish: 0,
			orderNum: orderNum,
			phone: usr.profile.cellNumber,
			carrier: usr.profile.cellCarrier,
			price: price,
		};
		ActiveOrders.insert(order);
		Local.remove({userId: usr._id});

		return 0;
	},   
  
  empPlaceShakeOrder: function(multiFlag, flavs, mixins, price, inHouse, usr, apple){
	  if(!multiFlag){
		  orderNum++;
	  }
      var order = {
        userId: usr._id,
        inHouse: inHouse,
        uName: usr.username,
		flavor: flavs,
		mixin: mixins,
        item: "Shake: ",
        submitted: new Date(),
        orderNum: orderNum,
        phone: usr.profile.cellNumber,
        carrier: usr.profile.cellCarrier,
        price: price,
      };
      ActiveOrders.insert(order);
      Local.remove({userId: usr._id});

      return 0;
  },
  
	employeePlaceOrder: function(multiFlag, thing, price, inHouse, usr, apple) {
		if(!multiFlag){
			orderNum++;
		}
		var order = {
			userId: usr._id,
			inHouse: inHouse,
			uName: apple,
			item: thing,
			start: new Date(),
			finish: 0,
			orderNum: orderNum,
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
	finishedOrder: function(thing, start, flavs, mixs, delID, price, inHouse, orNum, usrID, usrName, cellNum, cellCarrier){
		ActiveOrders.remove({_id: delID});
		var RO = ReadyOrders.find({orderNum: orNum, userId: usrID}).count();
		var FO = FinishedOrders.find({orderNum: orNum, userId: usrID}).count();
		var firstOrder = RO + FO; 
		if(firstOrder === 0){
			orderPrice = price; 
		}else{
			orderPrice = 0.00; 
		}
		var order = {
			userId: usrID,
			inHouse: inHouse,
			uName: usrName,
			item: thing,
			start: start,
			finish: new Date(),
			flavor: flavs, 
			mixin: mixs,
			orderNum: orNum,
			phone: cellNum,
			carrier: cellCarrier,
			price: orderPrice, 
		};
		ReadyOrders.insert(order);
		var remaining = ActiveOrders.find({orderNum: orNum}).count(); 
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
	/*	Email.send({
			from: "bandersnatchApp@gmail.com",
			to: "vanfos_c1@denison.edu",

			text: "Your " + thing + " is ready! You have " + remaining + " item(s) still in the kitchen!",
		});*/
		return 0;
	},

  // I don't think we actually call this method -- CVF
/*	employeeFinishedOrder: function(thing, start, delID, price, inHouse, apple, orNum, usr, cellNum, cellCarrier, shakes){
		var order = {
			userId: usr._id,
			inHouse: inHouse,
			uName: apple,
			item: thing,
			start: start,
			finish: new Date(),
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
	},*/
  
	pickUpOrder: function(thing, start, finish,delID, orNum, inHouse, price, usrID, cellNum){
		var order = {
			userId: usrID,
			inHouse: inHouse,
			item: thing,
			start: start, 
			finish: finish,
			orderNum: orNum,
			cellNumber: cellNum,
			price: price,
		};
		FinishedOrders.insert(order);
		ReadyOrders.remove({_id: delID});  

		return 0;
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
  
   sendEmail: function(emails){	 
	   var totOrders = FinishedOrders.find().fetch();
	   var price = 0.0;
	   var indvPrice = "";
	   var text = "";
	   var totPrice = 0.0;
	   var late = ""; 
	   for(var i = 0; i < totOrders.length; i++){
		  // console.log(price);
		   price += parseFloat(totOrders[i].price);
	   } 
	   text += "total revenue of the night: $" + price.toFixed(2) + "\n";
	   
	   var latePPL = ReadyOrders.find().fetch(); 
	   for(i = 0; i < latePPL.length; i++){
		   late += latePPL[i].uName + "\n";
	   }
	   if (late == ""){
		   late = 'None';
	   }
	   text += "List of people who didn't pick up Order: \n" + late + "\n\n";
	   text += "\n\n\n Stats from last night: " + "\n"
	   	   
	/* --------- num Pep Pizza Bagels --------- */
		var numPizzaBagel = 0;	
		var itemDeets;		// array for the items to fall into
		FinishedOrders.find().forEach(function(order){ itemDeets = order.item.split('\n'); 
			for(index = 0; index < itemDeets.length; index++){
				if(itemDeets[index] == 'Pizza Bagel (Pep) '){
					numPizzaBagel++;
				}
			}
		});
		totPrice += numPizzaBagel * 2.05;
		
	/* --------- num Cheez Pizza Bagels --------- */
		var numchez = 0;	
		var itemDeets3;		// array for the items to fall into
		FinishedOrders.find().forEach(function(order){ itemDeets3 = order.item.split('\n'); 
			for(index = 0; index < itemDeets3.length; index++){
				if(itemDeets3[index] == 'Pizza Bagel (Cheese) '){
					numchez++;
				}
			}
		});
		totPrice += 2.13*numchez;	
	   
	/* --------- num Snagels --------- */
	   
		var numSnagel = 0; 
		var itemDeets2;		// array for the items to fall into
		FinishedOrders.find().forEach(function(order){ itemDeets2 = order.item.split('\n'); 
			for(index = 0; index < itemDeets2.length; index++){
				if(itemDeets2[index] == 'Snagel '){
					numSnagel++;
				}
			}
		});
		totPrice += 0.64 * numSnagel;
		
	/* --------- num Klynch --------- */
	   
		var numK = 0; 
		var i4;		// array for the items to fall into
		FinishedOrders.find().forEach(function(order){ i4 = order.item.split('\n'); 
			for(index = 0; index < i4.length; index++){
				if(i4[index] == 'Klynch '){
					 numK++;
				}
			}
		});
		totPrice += 1.24 * numK;
		
	/* --------- num Nuckin' Futz --------- */
	   
		var numNF = 0; 
		var i5;		// array for the items to fall into
		FinishedOrders.find().forEach(function(order){ i5 = order.item.split('\n'); 
			for(index = 0; index < i5.length; index++){
				if(i5[index] == 'Nuckin\' Futz '){
					 numNF++;
				}
			}
		});
		totPrice += 1.12 * numNF;
		
	/* --------- num Pesto Bagel --------- */
	   
		var numPB = 0; 
		var i6;		// array for the items to fall into
		FinishedOrders.find().forEach(function(order){ i6 = order.item.split('\n'); 
			for(index = 0; index < i6.length; index++){
				if(i6[index] == 'Pesto Bagel '){
					 numPB++;
				}
			}
		});
		totPrice += 2.26 * numPB;
		
	/* --------- num Pesto Pepperoni --------- */
	   
		var numPBP = 0; 
		var i7;		// array for the items to fall into
		FinishedOrders.find().forEach(function(order){ i7 = order.item.split('\n'); 
			for(index = 0; index < i7.length; index++){
				if(i7[index] == 'Pesto Bagel (Pep) '){
					 numPBP++;
				}
			}
		});
		totPrice += 2.18 * numPBP;
		
	/* --------- num WDU bagel--------- */
	   
		var numWD = 0; 
		var i8;		// array for the items to fall into
		FinishedOrders.find().forEach(function(order){ i8 = order.item.split('\n'); 
			for(index = 0; index < i8.length; index++){
				if(i8[index] == 'WDU Bagel '){
					 numWD++;
				}
			}
		});
		totPrice += 1.12 * numWD;
		
	/* --------- num Half and Half--------- */
	   
		var numHH = 0; 
		var i9;		// array for the items to fall into
		FinishedOrders.find().forEach(function(order){ i9 = order.item.split('\n'); 
			for(index = 0; index < i9.length; index++){
				if(i9[index] == 'Half and Half '){
					 numHH++;
				}
			}
		});
		totPrice += 1.84 * numHH;
		
	/* --------- num Coffee --------- */
	   
		var numC = 0; 
		var i10;		// array for the items to fall into
		FinishedOrders.find().forEach(function(order){ i10 = order.item.split('\n'); 
			for(index = 0; index < i10.length; index++){
				if(i10[index] == 'Coffee'){
					 numC++;
				}
			}
		});
		totPrice += 0.20 * numC;
		
	/* --------- num Coffee --------- */
	   
		var numH = 0; 
		var i11;		// array for the items to fall into
		FinishedOrders.find().forEach(function(order){ i11 = order.item.split('\n'); 
			for(index = 0; index < i11.length; index++){
				if(i11[index] == 'Hum'){
					 numH++;
				}
			}
		});
		totPrice += 1.26 * numH;
	
	/* --------- num Chai H --------- */
	   
		var n1 = 0; 
		var i12;		// array for the items to fall into
		FinishedOrders.find().forEach(function(order){ i12 = order.item.split('\n'); 
			for(index = 0; index < i12.length; index++){
				if(i12[index] == 'Chai Tea (Hot)'){
					 n1++;
				}
			}
		});
		totPrice += 1.05 * n1;	
		
	/* --------- num Chai C --------- */
	   
		var n2 = 0; 
		var i13;		// array for the items to fall into
		FinishedOrders.find().forEach(function(order){ i13 = order.item.split('\n'); 
			for(index = 0; index < i13.length; index++){
				if(i13[index] == 'Chai Tea (Cold)'){
					 n2++;
				}
			}
		});
		totPrice += 1.05 * n2;	
		
		
	/* --------- num Iced Tea --------- */
	   
		var n3 = 0; 
		var i14;		// array for the items to fall into
		FinishedOrders.find().forEach(function(order){ i14 = order.item.split('\n'); 
			for(index = 0; index < i14.length; index++){
				if(i14[index] == 'Iced Tea'){
					 n3++;
				}
			}
		});
		totPrice += 0.31 * n3;	
		
	/* --------- num Latte --------- */
	   
		var n5 = 0; 
		var i16; 
		FinishedOrders.find().forEach(function(order){ i16 = order.item.split('\n'); 
			for(index = 0; index < i16.length; index++){
				if(i16[index] == 'Latte'){
					 n5++;
				}
			}
		});
		totPrice += 1.02 * n5;	
		
	/* --------- num Red Bull --------- */
	   
		var n6 = 0; 
		var i17; 
		FinishedOrders.find().forEach(function(order){ i17 = order.item.split('\n'); 
			for(index = 0; index < i17.length; index++){
				if(i17[index] == 'Red Bull'){
					 n6++;
				}
			}
		});
		totPrice += 0.54 * n6;	
		
	/* --------- num Soda --------- */
	   
		var n7 = 0; 
		var i18; 
		FinishedOrders.find().forEach(function(order){ i18 = order.item.split('\n'); 
			for(index = 0; index < i18.length; index++){
				if(i18[index] == 'Soda'){
					 n7++;
				}
			}
		});
		totPrice += 0.62 * n7;	
		
	/* --------- num Popcorn --------- */
	   
		var n7 = 0; 
		var i18; 
		FinishedOrders.find().forEach(function(order){ i18 = order.item.split('\n'); 
			for(index = 0; index < i18.length; index++){
				if(i18[index] == 'Popcorn '){
					 n7++;
				}
			}
		});
		totPrice += 0.17 * n7;	
		
	/* --------- num Pizza Pretzel --------- */
	   
		var n7 = 0; 
		var i18; 
		FinishedOrders.find().forEach(function(order){ i18 = order.item.split('\n'); 
			for(index = 0; index < i18.length; index++){
				if(i18[index] == 'Pizza Pretzel '){
					 n7++;
				}
			}
		});
		totPrice += 2.39 * n7;	
		
	/* --------- num Pizza Pretzel (PEP) --------- */
	   
		var n7 = 0; 
		var i18; 
		FinishedOrders.find().forEach(function(order){ i18 = order.item.split('\n'); 
			for(index = 0; index < i18.length; index++){
				if(i18[index] == 'Pizza Pretzel (Pep) '){
					 n7++;
				}
			}
		});
		totPrice += 2.31 * n7;	
		
	/* --------- num Hot Pretzel --------- */
	   
		var n7 = 0; 
		var i18; 
		FinishedOrders.find().forEach(function(order){ i18 = order.item.split('\n'); 
			for(index = 0; index < i18.length; index++){
				if(i18[index] == 'Hot Pretzel '){
					 n7++;
				}
			}
		});
		totPrice += 1.34 * n7;	
		
	/* --------- num Hot Pretzel Cheese --------- */
	   
		var n7 = 0; 
		var i18; 
		FinishedOrders.find().forEach(function(order){ i18 = order.item.split('\n'); 
			for(index = 0; index < i18.length; index++){
				if(i18[index] == 'Hot Pretzel (Cheese) '){
					 n7++;
				}
			}
		});
		totPrice += 1.60 * n7;	
		
		
	   
	 /*--------- num Shakes ---------
		var numShake = 0;
		var itemDeets4;		// array for the items to fall into
		FinishedOrders.find().forEach(function(order){ itemDeets4 = order.item.split('\n'); 
			for(index = 0; index < itemDeets4.length; index++){
				if(itemDeets4[index] == "Shake: "){
					numShake++;
				}
			}
		});
		text += "- Number of Shakes sold: " + numShake + "\n" */  
  
  
	  var recipients = '';
	   for(var i = 0; i < emails.length; i++){
		   recipients += emails[i];
	   }
	   console.log('recipients: ', recipients);
  	   text += "Total profit of the night: $" + totPrice.toFixed(2);
	   Email.send({
         from: "bandersnatchApp@gmail.com",
         to: recipients,

         subject: "Daily Stats",
         text: text, //Still Need to Implement
       });
	   
   },
 
   pushFinished: function(){
 	   var finished = FinishedOrders.find().fetch(); 
 	   for(var i = 0; i < finished.length; i++){
 		   FO = finished[i]; 
		   var order = {
			   usrID : FO.userId,
			   inHouse : FO.inHouse, 
			   item : FO.item,
			   start : FO.start, 
			   finish : FO.finish, 
			   orderNum : FO.orderNum, 
			   cellNumber : FO.cellNumber, 
			   price : FO.price,
		   };
		   Data.insert(order);
 	   }
	   FinishedOrders.remove({});
	   ReadyOrders.remove({});
   },
   
   empDiscount: function(){
		var orders = Local.find({userId: Meteor.user()._id}).fetch();
		var priceS =''; 
		for(var i = 0; i < orders.length; i++){
			var priceF = orders[i].price; 
			console.log('priceF: ', priceF);
			priceF = (0.75 * priceF);
			priceF = parseFloat(priceF.toFixed(2));
			console.log('new PriceF: ', priceF);
			Local.update({item: orders[i].item}, {$set: {price: priceF}}); 
		} 
		return 0;
   },
   
   stripDisc: function(){
	var orders = Local.find({userId: Meteor.user()._id}).fetch();
		for(var i = 0; i < orders.length; i++){
			var priceF = orders[i].price;
			console.log('priceS: ', priceF);
			priceF = (4/3)*priceF;
			priceF = parseFloat(priceF.toFixed(2));
			console.log('new price: ', priceF);
			Local.update({item: orders[i].item}, {$set: {price: priceF}});
		} 
		return 0;   	
   },
   
   /* on the Manager's page */
   
   addNewItem: function(type, Name, Price){
	   if (type == 'flavor'){
		   Milkshakes.insert({type: 'flavor', name: Name, price: Price});
	   }
	   else if (type == 'mixin'){
		   Milkshakes.insert({type: 'mixin', name: Name, price: Price});
	   }
	   else if (type == 'bagel'){
	   		Bagels.insert({type: Name, price: Price});
	   }
	   else if (type == 'snack'){
	   		Snacks.insert({type: Name, price: Price});
	   }
	   else if (type == 'bev'){
		   Beverages.insert({type: Name, price:Price});
	   }
   },
   
   deleteItem: function(itemType, item){
		if (itemType == 'bagel'){
			Bagels.remove({type: item});
		} 
		else if (itemType == 'snack'){
			Snacks.remove({type: item});
		}
		else if (itemType == 'bev'){
			Beverages.remove({type: item});
		}
		else if(itemType == "flavor" || itemType == 'mixin'){
			Milkshakes.remove({name: item});
		}
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
  }
  */
  
  
});