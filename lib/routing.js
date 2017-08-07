Router.route('/', function() {
    document.title = "Bandersnatch";
    this.wait(Meteor.subscribe('users'));
    if (this.ready()) {
        this.render('login');
    } else {
        this.render('loading');
    }
});

Router.route('/offScreen', function() {
    document.title = "Off Screen";
    this.render('offScreen');
});

Router.route('/menu', function() {
    document.title = "Menu | Bandersnatch";
    this.wait(Meteor.subscribe('users'));
    this.wait(Meteor.subscribe('local'));

    var holdOn = false;
    if (Meteor.user()) {
        holdOn = !Meteor.user().profile.dnum || !Meteor.user().profile.classYear;
    }

    if (this.ready() && holdOn) {
        this.render('forgotField');
    }
    else if (this.ready()) {
        this.render('menu');
    } else {
        this.render('loading');
    }
});

Router.route('/loading', function() {
    document.title = "Loading... | Bandersnatch";
    this.render('loading');
});

Router.route('/manager', function() {
    document.title = "Manager | Bandersnatch";
    this.wait(Meteor.subscribe('instance'));

    if (this.ready()) {
        this.render('manager');
    } else {
        this.render('loading');
    }
});

Router.route('/pseudoCheck', function() {
    this.wait(Meteor.subscribe('local'));

    if (this.ready()) {
        this.render('pseudoCheck');
    } else {
        this.render('loading');
    }

});

Router.route('/pseudoMenu', function() {
    this.wait(Meteor.subscribe('local'));

    if (this.ready()) {
        this.render('pseudoMenu');
    } else {
        this.render('loading');
    }
});

Router.route('/bagels', function() {
    document.title = "Bagels | Bandersnatch";
    this.wait(Meteor.subscribe('bagels'));
    this.wait(Meteor.subscribe('users'));

    if (this.ready()) {
        this.render('bagels');
    } else {
        this.render('loading');
    }
});

Router.route('/shakes', function() {
    document.title = "Shakes | Bandersnatch";
    this.wait(Meteor.subscribe('milkshakes'));
    this.wait(Meteor.subscribe('users'));

    if (this.ready()) {
        this.render('shakes');
    } else {
        this.render('loading');
    }
});

Router.route('/snacks', function() {
    document.title = "Snacks | Bandersnatch";
    this.wait(Meteor.subscribe('snacks'));
    this.wait(Meteor.subscribe('users'));

    if (this.ready()) {
        this.render('snacks');
    } else {
        this.render('loading');
    }
});

Router.route('/beverages', function() {
    document.title = "Beverages | Bandersnatch";
    this.wait(Meteor.subscribe('beverages'));
    this.wait(Meteor.subscribe('users'));

    if (this.ready()) {
        this.render('beverages');
    } else {
        this.render('loading');
    }
});

Router.route('/checkout', function() {
    document.title = "Checkout | Bandersnatch";
    this.wait(Meteor.subscribe('local'));
    this.wait(Meteor.subscribe('users'));

    if (this.ready()) {
        this.render('checkout');
    } else {
        this.render('loading');
    }
});

Router.route('/about', function() {
    document.title = "About | Bandersnatch";
    this.wait(Meteor.subscribe('users'));

    if (this.ready()) {
        this.render('about');
    } else {
        this.render('loading');
    }
});

Router.route('/settings', function() {
    document.title = "Settings | Bandersnatch";
    this.wait(Meteor.subscribe('users'));

    if (this.ready()) {
        this.render('settings');
    } else {
        this.render('loading');
    }
});

Router.route('/wait', function() {
    document.title = "Wait | Bandersnatch";
    this.wait(Meteor.subscribe('active'));

    if (this.ready()) {
        this.render('wait');
    } else {
        this.render('loading');
    }
});

Router.route('/thanks', function() {
    document.title = "Thanks | Bandersnatch";
    this.render('thanksForm');
});

Router.route('/thankYouCheckout', function() {
    document.title = "Checkout | Bandersnatch";
    this.render('thankYouCheckout');
});

Router.route('/backScreen', function() {
    document.title = "Back Screen | Bandersnatch";
    this.render('backScreen');
});

Router.route('/orderList', function() {
    document.title = "Order List | Bandersnatch";
    this.render('orderList');
});


Router.route('/signup', function() {
    document.title = "Sign Up | Bandersnatch";
    this.render('signupForm');
});

Router.route('/dnumUpdate', function() {
    this.render('dnumUpdateForm');
});

Router.route('/employee', function() {
    this.render('employee');
});

Router.route('/forgot', function() {
    document.title = "Forgot! | Bandersnatch";
    this.render('forgot');
});
