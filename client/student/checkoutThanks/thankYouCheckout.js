Meteor.subscribe('thankYouCheckout');


Template.thankYouCheckout.events({
    'click #thanks': function() {
        if (Meteor.user().roles == "student") {
            window.location.href = '/menu';
        } else {
            window.location.href = '/backScreen';
        }
    }
});

Template.thankYouCheckout.helpers({
    appOn: function() {
        var app = Instance.findOne({
            name: "bandersnatch"
        });
        if (app.status == "on") {
            return true;
        } else {
            return false;
        }
    }
});
