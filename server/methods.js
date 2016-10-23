
Meteor.methods({
	
	
	resetOrNum: function() {
		orderNum = 0;
	},
	setCap: function(){
 	   KitchenCap.insert({name: 'bandersnatch', capNum: 35});
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
			email: usr.profile.du,
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

	placeOrder: function(multiFlag, item, price, inHouse, usr){
		if(!multiFlag){
			orderNum++;
		}
		var CAP = KitchenCap.findOne({name: "bandersnatch"}).capNum;
		var order = {
			userId: usr._id,
			email: usr.profile.du,
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
		if(ActiveOrders.find().count() > CAP){
			Meteor.call('appOff',  function(error,result) {
				if (error)
					return alert(error.reason); 
			}); 
		}
		return ActiveOrders.find().count();
	},   
  
  empPlaceShakeOrder: function(multiFlag, flavs, mixins, price, inHouse, usr, apple){
	  if(!multiFlag){
		  orderNum++;
	  }
	  var CAP = KitchenCap.findOne({name: "bandersnatch"}).capNum;
      var order = {
        userId: usr._id,
        inHouse: inHouse,
        uName: apple,
		flavor: flavs,
		mixin: mixins,
        item: "Shake: ",
        start: new Date(),
		finish: 0,
        orderNum: orderNum,
        price: price,
      };
      ActiveOrders.insert(order);
      Local.remove({userId: usr._id});
		if(ActiveOrders.find().count() > CAP){
			Meteor.call('appOff',  function(error,result) {
				if (error)
					return alert(error.reason); 
			}); 
		}

      return 0;
  },
  
	employeePlaceOrder: function(multiFlag, thing, price, inHouse, usr, apple) {
		if(!multiFlag){
			orderNum++;
		}
		var CAP = KitchenCap.findOne({name: "bandersnatch"}).capNum;
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
		if(ActiveOrders.find().count() > CAP){
			Meteor.call('appOff',  function(error,result) {
				if (error)
					return alert(error.reason); 
			}); 
		}

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
		var CAP = KitchenCap.findOne({name: "bandersnatch"}).capNum;
		ActiveOrders.remove({_id: orderId});
		if(ActiveOrders.find().count() <= CAP){
			Meteor.call('appOn',  function(error,result) {
				if (error)
					return alert(error.reason); 
			}); 
		}
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
	finishedOrder: function(thing, start, flavs, mixs, delID, price, inHouse, orNum, usrID, usrName, usrEmail, cellNum, cellCarrier){
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
			email: usrEmail,
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
		if(!inHouse){
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
		
		
			if (thing == "Shake: ")
			{
				thing = "Milkshake";
			}
			
			
			Email.send({
				to: msg,
				from: "bandersnatchapp@gmail.com",
				text: "Your " + thing + " is ready! You have " + remaining + " item(s) still in the kitchen!",
			});
			
			Email.send({
				to: usrEmail,
				from: "bandersnatchapp@gmail.com",
				subject: "Bandersnatch Order Ready!",
				text: "Your " + thing + " is ready! You have " + remaining + " item(s) still in the kitchen!",
			});
		}
		if(ActiveOrders.find().count() <= 34){
			Meteor.call('appOn', function(error,result) {
				if (error)
					return alert(error.reason); 
			}); 
		}
		return 0;
	},
  
	pickUpOrder: function(thing, flavors, mixins, start, finish,delID, orNum, inHouse, price, usrID, cellNum){
		var order = {
			userId: usrID,
			inHouse: inHouse,
			item: thing,
			flavor: flavors, 
			mixin: mixins, 
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
  
	changeCap: function(cn){
		KitchenCap.update({name: "bandersnatch"}, {$set: {capNum: cn}});	
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
   
   delEmail: function(mail){
	   EmailList.remove({email:mail});
   },
   
   addToEmailList: function(mail){
	   var Email = {email: mail};
	   EmailList.insert(Email);
   },
   
   
  /* JSON2CSV: function(objArray) {
   	   var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;						// for email Excel doc
   	   var str = '';
   	   var line = '';

   	   for (var i = 0; i < array.length; i++) {
   	   	   var line = '';
   	   	   for (var index in array[i]) {
   	   	   	   line += array[i][index] + ',';
   	   	   }
        line = line.slice(0, -1);
        str += line + '\r\n';
       }
       return str;    
   },
  
   sendEmail: function(){	 
	   var totOrders = FinishedOrders.find().fetch();
	 //  console.log('total finished orders: ', totOrders);
	   var price = 0.0;
	   var indvPrice = "";
	   var text = "";
	   var totPrice = 0.0;
	   var late = ""; 
	   lateFlag = true; 
	   var lateOrNumList = [];
	   oCount= 0;
	   for(var i = 0; i < totOrders.length; i++){
		   price += parseFloat(totOrders[i].price);
	   } 
	   text += "total revenue of the night: $" + price.toFixed(2) + "\n";
	   
	   var latePPL = ReadyOrders.find().fetch(); 
	   for(i = 0; i < latePPL.length; i++){ 
		   oNum = latePPL[i].orderNum; 
		   for(var g = 0; g < lateOrNumList.length; g++){
			   if(lateOrNumList[g] === oNum){
				   lateFlag = false; 
			   }
		   }
		   if(lateFlag){
			   var latePrice = latePPL[i].price;
			   lateOrNumList[oCount] = oNum; 
			   if(latePrice === 0)
			   {
				   oCount++;
				   sameOrder = FinishedOrders.find({orderNum : oNum}).fetch();
				   for(var k = 0; k < sameOrder.length; k++)
				   {
					   if(sameOrder[k].price != 0)
					   {
						   latePrice = sameOrder[k].price;
					   }
				   }
				   if(latePrice === 0)				// If no order w this orderNum is in Finished yet
				   {
					   sameOrder = ReadyOrders.find({orderNum: oNum}).fetch(); 
					   for(vark = 0; k < sameOrder.length; k++)
					   {
						   if(sameOrder[k].price != 0)
						   {
							   latePrice = sameOrder[k].price; 
						   }
					   }
				   }
			   }
			   late += latePPL[i].email + " : " + latePrice + "\n";
		   }
		   lateFlag = true; 
	   }
	   if (late == ""){
		   late = "None";
	   }
	   text += "List of people who didn't pick up Order: \n" + late + "\n\n";
	//   text += "-------------------------------------------\n\n";
	   // text += " Stats from last night: " + "\n"
	   
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
	   emailChain = EmailList.find().fetch(); 
	   for(var i = 0; i < emailChain.length; i++){
		   recipients += emailChain[i].email + ', ';
	   }
	  
	  var psr = later.parse.recur().on('03:00:00').time();
	  
	  var data = FinishedOrders.find().fetch();		// Mongo DB stuff
   	  var yourCSV = Meteor.call('JSON2CSV', data, function(error, result) {
   	   		   if (error)
   	   		   	   return alert(error.reason);
   	   });
	  
	   SyncedCron.add({
	     name: 'Send email',
	     schedule: function(psr) {
	       // parser is a later.parse object
	       return psr.text('send email');
	     },
	     job: function() {
			// text += "Total profit of the night: $" + totPrice.toFixed(2);
			Email.send({
			    from: "bandersnatchApp@gmail.com",
			    to: recipients,

			    subject: "Daily Stats",
			    text: text, //Still Need to Implement
			    attachment: yourCSV,
			  }); 
			return 0
	     }
	   });

	   
   },
 
   pushFinished: function(){
	   Data.remove({});
	   
 	   var finished = FinishedOrders.find().fetch(); 
 	   for(var i = 0; i < finished.length; i++){
 		   FO = finished[i]; 
		   var startT = FO.start;
		   var finishT = FO.finish; 
		   
		   var startMin = startT.getMinutes(); 
		   if(startT.getMinutes() < 10){
			   startMin = '0' + startMin; 
		   }
		   var finishMin = finishT.getMinutes(); 
		   if(finishT.getMinutes() < 10){
			   finishMin = '0' + finishMin; 
		   }
		   var flav = FO.flavor;  
		   if(FO.flavor.includes('\n')){
			   var flavLen = FO.flavor.length;
			   flav = FO.flavor.substring(0, flavLen-1);
		   }
		   var mix = FO.mixin; 
		   if(FO.mixin.includes('\n')){
			   var mixLen = FO.mixin.length; 
			   mix = FO.mixin.substring(0, mixLen - 1);
		   }
		   
		   var itemz = FO.item; 
		   if(itemz === "Shake: "){
		       itemz = itemz.substring(0, itemz.length - 2);
		   }
		   var order = {
			   orderID: FO._id,
			   usrID : FO.userId,
			   item : itemz,
			   flavor: flav, 
			   mixin: mix, 
			   inHouse : FO.inHouse, 
			   date: startT.getUTCFullYear() + '-' + (startT.getUTCMonth() + 1)+'-' + startT.getUTCDate(),
			   start : startT.getHours() + ':'+ startMin + ':'+startT.getSeconds(),
			   finish : finishT.getHours() + ':' + finishMin + ':' +finishT.getSeconds(), 
		   };
		   Data.insert(order);
 	   }
	   FinishedOrders.remove({});
	   ReadyOrders.remove({});
	   ActiveOrders.remove({});
   },
   
   empDiscount: function(){
		var orders = Local.find({userId: Meteor.user()._id}).fetch();
		var priceS =''; 
		for(var i = 0; i < orders.length; i++){
			var priceF = orders[i].price; 
			priceF = (0.75 * priceF);
			priceF = parseFloat(priceF.toFixed(2));
			Local.update({item: orders[i].item}, {$set: {price: priceF}}); 
		} 
		return 0;
   },
   
   stripDisc: function(){
	var orders = Local.find({userId: Meteor.user()._id}).fetch();
		for(var i = 0; i < orders.length; i++){
			var priceF = orders[i].price;
			priceF = (4/3)*priceF;
			priceF = parseFloat(priceF.toFixed(2));
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
	   		Bagels.insert({type: 'bagel', name: Name, price: Price});
	   }
	   else if (type == 'snack'){
	   		Snacks.insert({type: 'snack', name: Name, price: Price});
	   }
	   else if (type == 'bev'){
		   Beverages.insert({type: 'bev', name: Name, price:Price});
	   }
   },
   
   deleteItem: function(itemType, item){
		if (itemType == 'bagel'){
			Bagels.remove({name: item});
		} 
		else if (itemType == 'snack'){
			Snacks.remove({name: item});
		}
		else if (itemType == 'bev'){
			Beverages.remove({name: item});
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