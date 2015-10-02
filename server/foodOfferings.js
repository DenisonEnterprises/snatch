//THIS ENTIRE FILE NEEDS TO BE DELETED!!!!!!!!


// Bagelz

if (Bagels.find().count() === 0){
  Bagels.insert({type:'bagel', name: 'Pizza Bagel (Cheese)', price: 3.00});
  Bagels.insert({type:'bagel', name: 'Pizza Bagel (Pep)', price: 3.00});
  Bagels.insert({type:'bagel', name: 'Snagel', price: 2.00});
  Bagels.insert({type:'bagel', name: 'Klynch', price: 2.00});
  Bagels.insert({type:'bagel', name: "Nuckin' Futz", price: 2.00});
  Bagels.insert({type:'bagel', name: 'Pesto Bagel', price: 3.25});
  Bagels.insert({type:'bagel', name: 'Pesto Bagel (Pep)', price: 3.25});
  Bagels.insert({type:'bagel', name: 'WDU Bagel', price: 2.00});
  Bagels.insert({type:'bagel', name: 'Half and Half', price: 3.00});
}


// Snacks

if (Snacks.find().count() === 0) {
  Snacks.insert({type:'snack', name: 'Popcorn', price: 1.00});
  Snacks.insert({type:'snack', name: 'Pizza Pretzel', price: 3.00});
  Snacks.insert({type:'snack', name: 'Pizza Pretzel (Pep)', price: 3.00});
  Snacks.insert({type:'snack', name: "Mad Hatter's Mix", price: 1.50});
  Snacks.insert({type:'snack', name: 'Hot Pretzel', price: 1.50});
  Snacks.insert({type:'snack', name: 'Hot Pretzel (Cheese)', price: 2.00});
}


// Beverages
 
if (Beverages.find().count() === 0) {
  Beverages.insert({type:'bev', name: 'Coffee', price: 1.00});
  Beverages.insert({type:'bev', name: 'Hum', price: 2.00});
  Beverages.insert({type:'bev', name: 'Chai Tea (Hot)', price: 2.00});
  Beverages.insert({type:'bev', name: 'Chai Tea (Cold)', price: 2.00});
  Beverages.insert({type:'bev', name: 'Iced Tea', price: 1.00});
  Beverages.insert({type:'bev', name: 'Latte', price: 2.00});
  Beverages.insert({type:'bev', name: 'Red Bull', price: 2.00});
  Beverages.insert({type:'bev', name: 'Soda', price: 1.00});
}

// Milkshakes -- flavor & mixin

if (Milkshakes.find().count() === 0){
  Milkshakes.insert({type: 'flavor', name: 'Vanilla', price: 3.00});
	Milkshakes.insert({type: 'flavor', name: 'Chocolate', price: 3.00});
	Milkshakes.insert({type: 'flavor', name: 'Dark Chocolate', price: 3.00});
	Milkshakes.insert({type: 'flavor', name: 'Caramel', price: 3.00});
	Milkshakes.insert({type: 'flavor', name: 'Chai', price: 3.00});
	Milkshakes.insert({type: 'flavor', name: 'Peppermint', price: 3.00});
	Milkshakes.insert({type: 'flavor', name: 'Hazelnut', price: 3.00});
	Milkshakes.insert({type: 'flavor', name: 'Irish Cream', price: 3.00});
	Milkshakes.insert({type: 'flavor', name: 'Banana', price: 3.00});
	Milkshakes.insert({type: 'flavor', name: 'Strawberry', price: 3.00});
	Milkshakes.insert({type: 'flavor', name: 'Pumpkin', price: 3.00});
	Milkshakes.insert({type: 'flavor', name: 'Raspberry', price: 3.00});
	Milkshakes.insert({type: 'flavor', name: 'Almond', price: 3.00});
	Milkshakes.insert({type: 'flavor', name: 'Coconut', price: 3.00});
  Milkshakes.insert({type: 'flavor', name: 'Cherry', price: 3.00});
  Milkshakes.insert({type: 'flavor', name: 'Pomegranate', price: 3.00});
  Milkshakes.insert({type: 'mixin', name: 'Oreo', price: 0.00});
	Milkshakes.insert({type: 'mixin', name: 'Reeses', price: 0.00});
	Milkshakes.insert({type: 'mixin', name: 'Peanut Butter', price: 0.00});
	Milkshakes.insert({type: 'mixin', name: 'M&M', price: 0.00});
	Milkshakes.insert({type: 'mixin', name: 'Nutella', price: 0.00});
	Milkshakes.insert({type: 'mixin', name: 'Butterfingers', price: 0.00});
	Milkshakes.insert({type: 'mixin', name: 'Heath', price: 0.00});
	Milkshakes.insert({type: 'mixin', name: 'Malt', price: 0.00});
	
	
  
}

if (Instance.find().count() == 0){
	Instance.insert({
		name: "bandersnatch",
		status: "on",
	});
}
   
