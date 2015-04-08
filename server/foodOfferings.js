//THIS ENTIRE FILE NEEDS TO BE DELETED!!!!!!!


// Bagels

if (Bagels.find().count() === 0){
  Bagels.insert({type: 'Pizza Bagel (Cheese) ', price: 3.00});
  Bagels.insert({type: 'Pizza Bagel (Pep) ', price: 3.00});
  Bagels.insert({type: 'Snagel ', price: 2.00});
  Bagels.insert({type: 'Klynch ', price: 1.75});
  Bagels.insert({type: "Nuckin' Futz ", price: 2.00});
  Bagels.insert({type: 'Pesto Bagel ', price: 3.25});
  Bagels.insert({type: 'WDU Bagel', price: 2.00});
  Bagels.insert({type: 'Pesto Bagel (Pep) ', price: 3.50});
  Bagels.insert({type: 'Half Bagel', price: 2.00});
}


// Snacks

if (Snacks.find().count() === 0) {
  Snacks.insert({type: 'Popcorn ', price: 1.00});
  Snacks.insert({type: 'Pizza Pretzel ', price: 3.00});
  Snacks.insert({type: 'Pita Pizza ', price: 4.00});
  Snacks.insert({type: "Mad Hatter's Mix ", price: 1.50});
  Snacks.insert({type: 'Hot Pretzel ', price: 1.50});
  Snacks.insert({type: 'Hot Pretzel (Cheese) ', price: 2.00});
  Snacks.insert({type: 'Hot Pretzel (Pep) ', price: 2.50});
}


// Beverages
 
if (Beverages.find().count() === 0) {
  Beverages.insert({type: 'Coffee', price: 1.00});
  Beverages.insert({type: 'Hum', price: 2.00});
  Beverages.insert({type: 'Chai Tea', price: 2.00});
  Beverages.insert({type: 'Iced Tea', price: 1.00});
  Beverages.insert({type: 'Latte', price: 2.00});
  Beverages.insert({type: 'Red Bull', price: 2.00});
  Beverages.insert({type: 'Soda', price: 1.00});
}

// Milkshakes -- flavor & mixin

if (Milkshakes.find().count() === 0){
  Milkshakes.insert({type: 'flavor', name: 'Vanilla', price: 3.00});
	Milkshakes.insert({type: 'flavor', name: 'Chocolate', price: 3.00});
	Milkshakes.insert({type: 'flavor', name: 'Dark Chocolate', price: 3.00});
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
   
