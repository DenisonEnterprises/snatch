Router.route('/', function() {
	
	
	this.wait(Meteor.subscribe('users'));
	
	
	if(this.ready()) {
    	this.render('login');
	}else{
		this.render('loading');
	}
	
});

Router.route('/offScreen', function() {
	this.render('offScreen');
});


Router.route('/menu', function () {
	this.wait(Meteor.subscribe('users'));
	this.wait(Meteor.subscribe('local'));
	
	if(this.ready()) {
    	this.render('menu');
	}else{
		this.render('loading');
	}
	
});



Router.route('/manager', function() {
	
	this.wait(Meteor.subscribe('instance'));
	
	if(this.ready()) {
		this.render('manager');
	}else{
		this.render('loading');
	}
});

Router.route('/pseudoCheck', function() {

	this.wait(Meteor.subscribe('local'));
	
	
	if(this.ready()) {
		this.render('pseudoCheck');
	}else{
		this.render('loading');
	}


});

Router.route('/pseudoMenu', function() {

	this.wait(Meteor.subscribe('local'));
	
	
	if(this.ready()) {
		this.render('pseudoMenu');
	}else{
		this.render('loading');
	}

});

Router.route('/bagels', function () {
	this.wait(Meteor.subscribe('bagels'));
	this.wait(Meteor.subscribe('users'));
	
	
	if(this.ready()) {
    	this.render('bagels');
	}else{
		this.render('loading');
	}
});




Router.route('/shakes', function () {
	this.wait(Meteor.subscribe('milkshakes'));
	this.wait(Meteor.subscribe('users'));
	
	if(this.ready()) {
    	this.render('shakes');
	}else{
		this.render('loading');
	}
});

Router.route('/snacks', function () {
	this.wait(Meteor.subscribe('snacks'));
	this.wait(Meteor.subscribe('users'));
	
	
	if(this.ready()) {
    	this.render('snacks');
	}else{
		this.render('loading');
	}
});

Router.route('/beverages', function () {
	this.wait(Meteor.subscribe('beverages'));
	this.wait(Meteor.subscribe('users'));
	
	
	if(this.ready()) {
    	this.render('beverages');
	}else{
		this.render('loading');
	}
});


Router.route('/checkout', function () {
	this.wait(Meteor.subscribe('local'));
	this.wait(Meteor.subscribe('users'));
	
	
	if(this.ready()) {
    	this.render('checkout');
	}else{
		this.render('loading');
	}
});


Router.route('/about', function () {
	this.wait(Meteor.subscribe('users'));
	
	
	if(this.ready()) {
    	this.render('about');
	}else{
		this.render('loading');
	}
});

Router.route('/settings', function () {
	this.wait(Meteor.subscribe('users'));
	
	if(this.ready()) {
    	this.render('settings');
	}else{
		this.render('loading');
	}
});









Router.route('/thanks', function () {
  this.render('thanksForm');
});


Router.route('/thankYouCheckout', function(){
  this.render('thankYouCheckout');
}); 



Router.route('/backScreen', function() {
	this.render('backScreen');
});

Router.route('/orderList', function() {
	this.render('orderList');
});


Router.route('/signup', function () {
  this.render('signupForm');
});

Router.route('/employee', function () {
  this.render('employee');
});


Router.route('/forgot', function () {
  this.render('forgot');
});




