Meteor.subscribe('local');
Meteor.subscribe('users');

Template.menu.rendered = function() {

    var button = document.getElementById("cout");

    if (Local.find({
            userId: Meteor.user()._id
        }).count() > 0) {
        $("#cout").css("cursor", "pointer");
        button.disabled = false;
        button.style.opacity = "1.0";
        button.style.filter = 'alpha(opacity=100)'; // IE fallback
    }

    var type = window.location.hash.substr(1);
    if (type === "u") {
        window.history.pushState("", "", '/menu');

        $("#cout").css("cursor", "pointer");
        button.disabled = false;
        button.style.opacity = "1.0";
        button.style.filter = 'alpha(opacity=100)'; // IE fallback

        setTimeout(function() {
            $("#notif").fadeIn(500);
        }, 50);

        setTimeout(function() {
            $("#notif").fadeOut(2000);
        }, 3000);
    }

    if (type === "m") {
        window.history.pushState("", "", '/menu');
        $("#cout").css("cursor", "pointer");
        button.disabled = true;
        button.style.opacity = "0.4";
        button.style.filter = 'alpha(opacity=40)'; // IE fallback
    }
}

Template.menu.events({
    "click #bagelBTN": function(evt, instance) {
        Router.go('bagels');
    },

    "click #shakesBTN": function(evt, instance) {
        Router.go('shakes');
    },
    "click #snackBTN": function(evt, instance) {
        Router.go('snacks');
    },
    "click #bevsBTN": function(evt, instance) {
        Router.go('beverages');
    },
    "click #cout": function(evt, instance) {
        // Start of D# checking

        var user = Meteor.user();
        var d = user.profile.dnum;

        if (d != undefined) {
            Router.go('/checkout');
        } else {
            Router.go("/dnumUpdate");
        }

    },

    "click #logout": function(evt, instance) {
        Meteor.call("delLocalByUser");
        Meteor.logout();
        Router.go("/#l")
    }
});

Template.menu.helpers({
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
