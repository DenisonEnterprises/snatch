Router.route('/', function () {
  this.render('login');
});

Router.route('/menu', function () {
  //if (Roles.userIsInRole(Meteor.user()._id, 'student')){
    this.render('menu');
  //}else{
    //this.render('denied');
  //}
});

Router.route('/bagels', {
  name: 'bagels',
  template: 'bagels'
});

Router.route('/pseudoMenu', function() {
	this.render('/pseudoMenu');
});

Router.route('/backScreen', function() {
	this.render('backScreen');
});

Router.route('/orderList', function() {
	this.render('orderList');
});

Router.route('/shakes', function () {
  this.render('shakes');
});

Router.route('/snacks', function () {
  this.render('snacks');
});

Router.route('/beverages', function () {
  this.render('beverages');
});

Router.route('/signup', function () {
  this.render('signupForm');
});

Router.route('/checkout', function () {
  this.render('checkout');
});

Router.route('/employee', function () {
  this.render('employee');
});

Router.route('/about', function () {
  this.render('about');
});

Router.route('/settings', function () {
  this.render('settings');
});

Router.route('/thanks', function () {
  this.render('thanksForm');
});


Router.route('/denied', function () {
  this.render('denied');
});

Router.route('/thankYouCheckout', function(){
  this.render('thankYouCheckout');
}); 
