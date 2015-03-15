// Bagels

if (Bagels.find().count() === 0) {
	Bagels.insert({type: 'Pizza Bagel (Cheese) ', price: 2.75});
  Bagels.insert({type: 'Pizza Bagel (Pepperoni) ', price: 2.75});
  Bagels.insert({type: 'Snagel ', price: 2.00});
  Bagels.insert({type: 'Klynch ', price: 1.75});
  Bagels.insert({type: "Nuckin' Futz ", price: 2.00});
  Bagels.insert({type: 'Pesto Bagel ', price: 3.25});
}


// Snacks

if (Snacks.find().count() === 0) {
  Snacks.insert({type: 'Popcorn ', price: 1.00});
  Snacks.insert({type: 'Pizza Pretzel ', price: 2.75});
  Snacks.insert({type: 'Pita Pizza ', price: 4.00});
  Snacks.insert({type: 'Nerds Rope ', price: 1.25});
  Snacks.insert({type: "Mad Hatter's Mix ", price: 1.50});
  Snacks.insert({type: 'Hot Pretzel ', price: 1.50});
  Snacks.insert({type: 'Hot Pretzel (Cheese) ', price: 2.00});
}


// Beverages
 
if (Beverages.find().count() === 0) {
  Beverages.insert({type: 'Coffee ', price: 1.00});
  Beverages.insert({type: 'Hum ', price: 2.00});
  Beverages.insert({type: 'Chai Tea ', price: 2.00});
  Beverages.insert({type: 'Iced Tea ', price: 1.00});
  Beverages.insert({type: 'Latte ', price: 2.00});
  Beverages.insert({type: 'Red Bull ', price: 2.00});
  Beverages.insert({type: 'Soda ', price: 1.00});
}

// Milkshakes -- flavor & mixin

if (Milkshakes.find().count() === 0){
  Milkshakes.insert({type: 'flavor', name: 'Vanilla ', price: 2.75});
	Milkshakes.insert({type: 'flavor', name: 'Chocolate ', price: 2.75});
	Milkshakes.insert({type: 'flavor', name: 'Dark Chocolate ', price: 2.75});
	Milkshakes.insert({type: 'flavor', name: 'White Chocolate ', price: 2.75});
	Milkshakes.insert({type: 'flavor', name: 'Chai ', price: 2.75});
	Milkshakes.insert({type: 'flavor', name: 'Peppermint ', price: 2.75});
	Milkshakes.insert({type: 'flavor', name: 'Hazelnut ', price: 2.75});
	Milkshakes.insert({type: 'flavor', name: 'Irish Cream ', price: 2.75});
	Milkshakes.insert({type: 'flavor', name: 'Banana ', price: 2.75});
	Milkshakes.insert({type: 'flavor', name: 'Strawberry ', price: 2.75});
	Milkshakes.insert({type: 'flavor', name: 'Pumpkin ', price: 2.75});
	Milkshakes.insert({type: 'flavor', name: 'Raspberry ', price: 2.75});
	Milkshakes.insert({type: 'flavor', name: 'Almond ', price: 2.75});
	Milkshakes.insert({type: 'flavor', name: 'Coconut ', price: 2.75});
  Milkshakes.insert({type: 'flavor', name: 'Cherry ', price: 2.75});
  Milkshakes.insert({type: 'flavor', name: 'Pomegranate ', price: 2.75});
  Milkshakes.insert({type: 'mixin', name: 'Oreo ', price: 0.00});
	Milkshakes.insert({type: 'mixin', name: 'Reeses ', price: 0.00});
	Milkshakes.insert({type: 'mixin', name: 'Peanutbutter ', price: 0.00});
	Milkshakes.insert({type: 'mixin', name: 'M&M ', price: 0.00});
	Milkshakes.insert({type: 'mixin', name: 'Nutella ', price: 0.00});
	Milkshakes.insert({type: 'mixin', name: 'Butterfingers ', price: 0.00});
	Milkshakes.insert({type: 'mixin', name: 'Snickers ', price: 0.00});
	Milkshakes.insert({type: 'mixin', name: 'Heath ', price: 0.00});
	Milkshakes.insert({type: 'mixin', name: 'Malt ', price: 0.00});
  
  // ---------- Create Employee Account ---------------------
  // MOVE IN THE FUTURE!!!!!!!!!!!!!!!!!!!!!!!
  
  //var bsUser = Meteor.users.findOne({username: "BSNEMP"}); 
  //Roles.createRole('employee');
  //Roles.setUserRoles(bsUser, 'employee');
}

   
