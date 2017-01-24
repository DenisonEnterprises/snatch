
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

	shakeOrder: function(flavors, mixins, toppings, price) {
		var user = Meteor.user();
		var str =  "Shake: ";
		var order = {
			type: "shake",
			userId: user._id,
			flavor: flavors,
			mixin: mixins,
			topping: toppings,
			uName: user.username,
			price: price,
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
 
    placeShakeOrder: function(multiFlag, flavs, mixins, toppings, price, inHouse, usr, comment) {
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
			topping: toppings,
			item: "Shake: ",
			orderNum: orderNum,
			phone: usr.profile.cellNumber,
			carrier: usr.profile.cellCarrier,
			price: price,
			dnum: usr.profile.dnum,
			comment: comment,
		};
		ActiveOrders.insert(order);
		Local.remove({userId: usr._id});

		return 0;
    },  

	placeOrder: function(multiFlag, item, price, inHouse, usr, comment){
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
			dnum: usr.profile.dnum,
			comment: comment,
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
  
  empPlaceShakeOrder: function(multiFlag, flavs, mixins, toppings, price, inHouse, usr, apple, comment){
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
		topping: toppings,
        item: "Shake: ",
        start: new Date(),
		finish: 0,
        orderNum: orderNum,
        price: price,
		comment: comment,
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
  
	employeePlaceOrder: function(multiFlag, thing, price, inHouse, usr, apple, comment) {
		if(!multiFlag){
			orderNum++;
		}
		var CAP = KitchenCap.findOne({name: "bandersnatch"}).capNum;
		//var startTime = new Date();
		//startTime.setTime(startTime.getTime()+startTime.getTimezoneOffset());

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
			comment: comment,
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
	finishedOrder: function(thing, start, flavs, mixs, tops, delID, price, inHouse, orNum, usrID, usrName, usrEmail, cellNum, cellCarrier, dnum){
		ActiveOrders.remove({_id: delID});
		var RO = ReadyOrders.find({orderNum: orNum, userId: usrID}).count();
		var FO = FinishedOrders.find({orderNum: orNum, userId: usrID}).count();
		var usr = Meteor.users.find({_id: usrID});
		var firstOrder = RO + FO; 
		if(firstOrder === 0){
			orderPrice = price; 
		}else{
			orderPrice = 0.00; 
		}
		var finishTime = new Date();
		//var offSet = finishTime.getTimezoneOffset();
		//offSet = offSet / 60;
		//finishTime.setHours(finishTime.getUTCHours() - offSet);
		//setTime(finishTime.getTime()+finishTime.getTimezoneOffset());

		var order = {
			userId: usrID,
			email: usrEmail,
			inHouse: inHouse,
			uName: usrName,
			item: thing,
			start: start,
			finish: finishTime,
			flavor: flavs, 
			mixin: mixs,
			topping: tops,
			orderNum: orNum,
			phone: cellNum,
			carrier: cellCarrier,
			price: orderPrice, 
			dnum: dnum,
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
  
	pickUpOrder: function(thing, flavors, mixins, toppings, start, finish,delID, orNum, inHouse, price, usrID, cellNumber, dnum){
		var usr = Meteor.users.find({_id: usrID});
		var order = {
			userId: usrID,
			inHouse: inHouse,
			item: thing,
			flavor: flavors, 
			mixin: mixins, 
			topping: toppings,
			start: start, 
			finish: finish,
			orderNum: orNum,
			phone: cellNumber,
			price: price,
			dnum: dnum,
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
   }, */
  
   sendEmail: function(){
	   var totOrders = FinishedOrders.find().fetch();
	   var price = 0.0;
	   var indvPrice = "";
	   var text = "";
	   var totPrice = 0.0;
	   var late = "";
	   for(var i = 0; i < totOrders.length; i++){
		   price += parseFloat(totOrders[i].price);
	   }
	   //var utc = new Date().toJSON().slice(0,10);

	   var today = new Date();
	   var yesterday = new Date(today);
	   yesterday.setDate(today.getDate() - 1);
	   yesterday.toJSON().slice(0,10);

	   //var dd = yesterday.getDate();
	   //var mm = yesterday.getMonth()+1;
	   //var yyyy = yesterday.getFullYear();
	   //if(dd < 10) {dd = '0'+dd}
	   //if(mm<10) {mm = '0'+mm}
	   //yesterday = dd+'/'+mm+'/'+yyyy;

	   //text += "Date: " + utc;
	   text += "Date: " + yesterday;
	   text += "\n" + "total revenue of the night: $" + price.toFixed(2) + "\n\n";
	   
	   var products = [];																// Code below finds current product list -- don't want product list hard-coded
	   products.push("Shake: ");
	   
	   Bagels.find().forEach(function(names){ nameList = names.name.split('\n'); 
			for(index = 0; index < nameList.length; index++){
				products.push(nameList[index]);
			}
		});
		
		Snacks.find().forEach(function(names){ nameList = names.name.split('\n'); 
			for(index = 0; index < nameList.length; index++){
				products.push(nameList[index]);
			}
		});
	   
	   Beverages.find().forEach(function(names){ nameList = names.name.split('\n'); 
			for(index = 0; index < nameList.length; index++){
				products.push(nameList[index]);
			}
		});
		
		/*
		text += "\n========== Sales broken down in 30 minute intervals ========== \n\n";
		
		var currentDate = new Date();
		//currentDate.setTime(currentDate.getTime()+currentDate.getTimezoneOffset());													// Finds current date to use in email
		var year = currentDate.getUTCFullYear();
		var month = currentDate.getUTCMonth() + 1;
		var day = currentDate.getUTCDate();
		
		var allOrdersTimeCorrect = FinishedOrders.find().fetch().reverse();
		var orderCount = 0;
		var orderCountLength = allOrdersTimeCorrect.length;
		
		var timeArrayText = ["21:00 - 21:30", "21:30 - 22:00", "22:00 - 22:30", "22:30 - 23:00", "23:00 - 23:30", "23:30 - 00:00", "00:00 - 00:30", "00:30 - 01:00", "01:00 - 01:30", "01:30 - 02:00"];
		var timeCutOffs = ["21:29:59:999", "21:59:59:999", "22:29:59:999", "22:59:59:999", "23:29:59:999", "23:59:59:999", "00:29:59:999", "00:59:59:999", "01:29:59:999", "01:59:59:999"];
		//var timeCutOffs = ["02:29:59:999", "02:59:59:999", "03:29:59:999", "03:59:59:999", "05:29:59:999", "05:59:59:999", "06:29:59:999", "06:59:59:999", "07:29:59:999", "07:59:59:999"];

		for (t = 0; t < timeCutOffs.length; t++) {				// For each time range
			text += timeArrayText[t] + "   ";
			
			var productDict = {};
			for(i = 0; i < products.length; i++){
				var nameOfProduct = products[i];
				productDict[nameOfProduct] = 0;
			};
			
			var time = timeCutOffs[t];
			var timeArray = time.split(":");
			
			var hour = parseInt(timeArray[0], 10);
			var minute = parseInt(timeArray[1], 10);
			var second = parseInt(timeArray[2], 10);
			var millisecond = parseInt(timeArray[3], 10);
			
			
			if (orderCount<orderCountLength) {
				var DATE = allOrdersTimeCorrect[orderCount].finish;
				var YR = parseInt(DATE.getUTCFullYear(), 10);
				var MO = parseInt((DATE.getUTCMonth() + 1), 10);
				var DY = parseInt(DATE.getUTCDate(), 10);
				var HR = parseInt(DATE.getUTCHours(), 10);
				var MN = parseInt(DATE.getUTCMinutes(), 10);
				var SC = parseInt(DATE.getUTCSeconds(), 10);
				var MS = parseInt(DATE.getUTCMilliseconds(), 10);
			}
			
			while((orderCount<orderCountLength)&&(HR <= hour)&&(MN <= minute)&&(SC <= second)&&(MS <= millisecond)) {
				var currentProd = allOrdersTimeCorrect[orderCount].item;
				productDict[currentProd] += 1;
				orderCount += 1;
				
				if ((orderCount>=orderCountLength)) {
					break;
				}
				else {
					var DATE = allOrdersTimeCorrect[orderCount].finish;
					var YR = parseInt(DATE.getUTCFullYear(), 10);
					var MO = parseInt((DATE.getUTCMonth() + 1), 10);
					var DY = parseInt(DATE.getUTCDate(), 10);
					var HR = parseInt(DATE.getUTCHours(), 10);
					var MN = parseInt(DATE.getUTCMinutes(), 10);
					var SC = parseInt(DATE.getUTCSeconds(), 10);
					var MS = parseInt(DATE.getUTCMilliseconds(), 10);
				};
			};
			
			for(i = 0; i < products.length; i++){
				var nameOfProduct = products[i];
				if (nameOfProduct == "Shake: ") {
					text += nameOfProduct + productDict[nameOfProduct] + "   ";
				}
				else {
					text += nameOfProduct  + ": " + productDict[nameOfProduct] + "   ";
				};
			};
			text += "\n\n";
		}
		*/
		
		text += "\n\n" + "========== Total sales by item ========== \n\n";						// Finds total number of each product sold during the night
		
		for(i = 0; i < products.length; i++){
			var nameOfProduct = products[i];
			var currentProduct = 0;
			var itemArray;
			FinishedOrders.find().forEach(function(order){ itemArray = order.item.split('\n'); 
				for(index = 0; index < itemArray.length; index++){
					if(itemArray[index] == nameOfProduct){
						currentProduct++;
					}
				}
			});
			if (products[i] == "Shake: ") {
				text += products[i] + currentProduct + "\n";
			}
			else {
				text += products[i]  + ": " + currentProduct + "\n";
			};
		}
	   
	   text += "\n\n" + "========== Sales by order number ==========";						// Goes through and prints specs of every order
			
		var latePPL = ReadyOrders.find().fetch();								// If the order is still in  readyOrders, then add to late text
	   var lateOrderNumPPL = {};
	   for(i = 0; i < latePPL.length; i++){
		   var orderNum = latePPL[i].orderNum;
		   if (lateOrderNumPPL[orderNum]) {								
			   late += "\n\n\t made @: " + latePPL[i].finish;
				if (latePPL[i].item != "") {
					late += "\n\t item: " + latePPL[i].item;
				}
				if (latePPL[i].flavor != "") {
					var stringFlavorLate = latePPL[i].flavor;
					late += "\n\t flavor: " + stringFlavorLate.replace(/(\r\n|\n|\r)/gm,"");
				}
				if (latePPL[i].mixin != "") {
					var stringMixinLate = latePPL[i].mixin;
					late += "\n\t mixin: " + stringMixinLate.replace(/(\r\n|\n|\r)/gm,"");
				}
				if (latePPL[i].topping != "") {
					var stringToppingLate = latePPL[i].topping;
					late += "\n\t topping: " + stringToppingLate.replace(/(\r\n|\n|\r)/gm,"");
				};
		   }
				
			else{																// Haven't create a section for particular order # yet
				late += "\n\n\n order #: " + latePPL[i].orderNum;
				late += "\n\t inHouse: " + latePPL[i].inHouse;
				if (latePPL[i].inHouse == false) {
					late += "\n\t\t D#: " + latePPL[i].dnum;
					late += "\n\t\t phone: " + latePPL[i].phone;
					late += "\n\t\t email: " + latePPL[i].email;
					late += "\n";
				}
				
				var listOfSameLate = ReadyOrders.find({"orderNum": latePPL[i].orderNum}).fetch();
				for (j = 0; j < listOfSameLate.length; j++) {
					var currentOrderLate = listOfSameLate[j];
					if (currentOrderLate.price > 0) {
						late += "\n\t price: $" + currentOrderLate.price + "\n";
					}
				}
				late += "\n\t made @: " + latePPL[i].finish;
				
				if (latePPL[i].item != "") {
					late += "\n\t item: " + latePPL[i].item;
				}
				if (latePPL[i].flavor != "") {
					var stringFlavorLate = latePPL[i].flavor;
					late += "\n\t flavor: " + stringFlavorLate.replace(/(\r\n|\n|\r)/gm,"");
				}
				if (latePPL[i].mixin != "") {
					var stringMixinLate = latePPL[i].mixin;
					late += "\n\t mixin: " + stringMixinLate.replace(/(\r\n|\n|\r)/gm,"");
				}
				if (latePPL[i].topping != "") {
					var stringToppingLate = latePPL[i].topping;
					late += "\n\t topping: " + stringToppingLate.replace(/(\r\n|\n|\r)/gm,"");
				}
				lateOrderNumPPL[orderNum] = 1;
			}
	   }
	   
		
	   if (late == ""){
		   late = "None";
	   }
	   late = "People who didn't pick up their order: " + late + "\n\n";
	   
	   /////////////////////////////
	   
	   var PPL = FinishedOrders.find().fetch();											// Picked up order specs
	   var orderNumPPL = {};
	   for(i = 0; i < PPL.length; i++){
		   var orderNum = PPL[i].orderNum;
		   if (orderNumPPL[orderNum]) {
			   text += "\n\n\t made @: " + PPL[i].finish;
				if (PPL[i].item != "") {
					text += "\n\t item: " + PPL[i].item;
				}
				if (PPL[i].flavor != "") {
					var stringFlavor = PPL[i].flavor;
					text += "\n\t flavor: " + stringFlavor.replace(/(\r\n|\n|\r)/gm,"");
				}
				if (PPL[i].mixin != "") {
					var stringMixin = PPL[i].mixin;
					text += "\n\t mixin: " + stringMixin.replace(/(\r\n|\n|\r)/gm,"");
				}
				if (PPL[i].topping != "") {
					var stringTopping = PPL[i].topping;
					text += "\n\t topping: " + stringTopping.replace(/(\r\n|\n|\r)/gm,"");
				};
		   }
				
			else{
				text += "\n\n\n order #: " + PPL[i].orderNum;
				text += "\n\t inHouse: " + PPL[i].inHouse;
				if (PPL[i].inHouse == false) {
					text += "\n\t\t phone: " + PPL[i].phone + "\n";
				}
				
				var listOfSame = FinishedOrders.find({"orderNum": PPL[i].orderNum}).fetch();
				for (j = 0; j < listOfSame.length; j++) {
					var currentOrder = listOfSame[j];
					if (currentOrder.price > 0) {
						text += "\n\t price: $" + currentOrder.price + "\n";
					}
				}
				text += "\n\t made @: " + PPL[i].finish;
				
				if (PPL[i].item != "") {
					text += "\n\t item: " + PPL[i].item;
				}
				if (PPL[i].flavor != "") {
					var stringFlavor = PPL[i].flavor;
					text += "\n\t flavor: " + stringFlavor.replace(/(\r\n|\n|\r)/gm,"");
				}
				if (PPL[i].mixin != "") {
					var stringMixin = PPL[i].mixin;
					text += "\n\t mixin: " + stringMixin.replace(/(\r\n|\n|\r)/gm,"");
				}
				if (PPL[i].toping != "") {
					var stringTopping = PPL[i].topping;
					text += "\n\t topping: " + stringTopping.replace(/(\r\n|\n|\r)/gm,"");
				}
				orderNumPPL[orderNum] = 1;
			}
	   }
	   
	   //////////////////////////////////////
	  
	  var recipients = '';
	   emailChain = EmailList.find().fetch(); 
	   for(var i = 0; i < emailChain.length; i++){
		   recipients += emailChain[i].email + ', ';
	   };
	   
	   Email.send({
			    from: "bandersnatchapp@gmail.com",
			    to: recipients,

			    subject: "Didn't Pick Up Order",
			    text: late,
			  }); 
	  
	  Email.send({
			    from: "bandersnatchapp@gmail.com",
			    to: recipients,

			    subject: "Daily Stats",
			    text: text,
			  }); 
   },
 
   pushFinished: function(){
	   
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
			   dnum: FO.dnum,
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
	   else if (type == 'topping'){
		   Milkshakes.insert({type: 'topping', name: Name, price: Price});
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
   
   

  createAct: function() {
      var bsUser = Meteor.users.findOne({username: "bsnemp2"}); 
      Roles.createRole('employee2');
	  Roles.setUserRoles(bsUser, 'employee2');
 
      var bsUser1 = Meteor.users.findOne({username: "bsnemp"}); 
      Roles.createRole('employee');
	  Roles.setUserRoles(bsUser1, 'employee');
	
      var mana = Meteor.users.findOne({username: "bsnman"}); 
      Roles.createRole('manager');
      Roles.setUserRoles(mana, 'manager');
  }
  
  
});