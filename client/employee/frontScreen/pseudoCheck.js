Meteor.subscribe('local');
Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');

justClickedOn = true;
justClickedOff = false;

Template.PseudoShake.helpers({
    'mixins': function() {
        return this.mixin;
    }
});

Template.PseudoShake.helpers({
    'flavors': function() {
        return this.flavor;
    }
});

Template.PseudoShake.helpers({
    'toppings': function() {
        return this.topping;
    }
});


Template.PseudoShake.helpers({
    'shake': function() {
        return this.item;
    }
});

Template.PseudoShake.helpers({
    'price': function() {
        return '$' + this.price.toFixed(2);
    }
});

Template.PseudoShake.helpers({
    'shakey': function() {
        return this.item == "Shake: ";
    }
});

Template.pseudoCheck.rendered = function() {
    $('#appleName').on('input', function() {

        var input = $(this).val();
        var button = document.getElementById("placeOrder");

        justClickedOn = true;
        justClickedOff = false;

        if (input.length > 0) {
            $("#placeOrder").css("cursor", "pointer");
            button.disabled = false;
            button.style.opacity = "1.0";
            button.style.filter = 'alpha(opacity=100)'; // IE fallback
        } else {
            //disable
            $("#cout").css("cursor", "none");
            button.disabled = true;
            button.style.opacity = "0.4";
            button.style.filter = 'alpha(opacity=40)'; // IE fallback
        }
    });

}


Template.pseudoCheck.helpers({
    'order': function() {
        //if prevents error due to ordering of page loading, etc.
        if (Meteor.user()) {
            var user = Meteor.user();
            return Local.find({
                userId: user._id
            });
        }
    },

    'totalPrice': function() {
        var orders = Local.find({
            userId: Meteor.user()._id
        }).fetch();
        var total = 0.0;
        var indvPrice = "";
        for (i = 0; i < orders.length; i++) {
            if ((orders[i].type != "flavor") && (orders[i].type != "mixin")) {
                indvPrice = orders[i].price;
                total = total + parseFloat(indvPrice);
            }
        }
        total = total.toFixed(2);
        return "$" + total;
    },
});

Template.pseudoCheck.events({
    'click': function(evt, instance) { // get all clicks
        if (empDisc.checked && justClickedOn) {
            var countClick = 1;
            justClickedOn = false;
            justClickedOff = true;
            Meteor.call("empDiscount", function(error, result) {
                if (error) {
                    return error.reason;
                }
            });
        }
        if (!empDisc.checked && justClickedOff) {
            justClickedOn = true;
            justClickedOff = false;
            Meteor.call('stripDisc', function(error, result) {
                if (error) {
                    return error.reason;
                }
            });
        }
    },
});

Template.pseudoCheck.events({
    'click #placeOrder': function() {
        var orders = Local.find({
            userId: Meteor.user()._id
        }).fetch();
        var str = "";
        var temp = "";
        var total = 0.0;
        var indvPrice = "";
        for (i = 0; i < orders.length; i++) {
            if ((orders[i].type != "flavor") && (orders[i].type != "mixin") && (orders[i].type != "topping")) {
                indvPrice = orders[i].price;
                total = total + parseFloat(indvPrice);
            }
        }
        total = total.toFixed(2);
        console.log('TOTAL PRICE: ', total);
        var indvPrice = "";

        var shakeStr = false;
        shakes = [];
        items = [];

        var apple = $($('#appleName')).val();
        var comment = $($('#commentName')).val();
        for (i = 0; i < orders.length; i++) {
            var indvPrice = "";
            indvPrice = (orders[i].price);
            temp = indvPrice;

            if (orders[i].item == "Shake: ") {
                shakes.push(orders[i]);
                shakeStr = true;
            } else {
                items.push(orders[i].item);
            }
        }
        var multiFlag = false;

        if (shakeStr) {
            //seperate into seperate shake orders
            str += "Shake: \n";
            for (var k = 0; k < shakes.length; k++) {
                if (k == 0) {
                    Meteor.call('empPlaceShakeOrder', multiFlag, shakes[k].flavor, shakes[k].mixin, shakes[k].topping, total, true, Meteor.user(), apple, comment, function(error, result) {
                        if (error)
                            return alert(error.reason);
                    });
                } else {
                    multiFlag = true;
                    Meteor.call('empPlaceShakeOrder', multiFlag, shakes[k].flavor, shakes[k].mixin, shakes[k].topping, total, true, Meteor.user(), apple, comment, function(error, result) {
                        if (error)
                            return alert(error.reason);
                    });
                }
            }
        }

        for (var j = 0; j < items.length; j++) {
            if (shakeStr || j > 0) {
                multiFlag = true;
                Meteor.call('employeePlaceOrder', multiFlag, items[j], total, true, Meteor.user(), apple, comment, function(error, result) {
                    if (error)
                        return alert(error.reason);
                });
            } else if (j == 0) {
                multiFlag = false;
                Meteor.call('employeePlaceOrder', multiFlag, items[j], total, true, Meteor.user(), apple, comment, function(error, result) {
                    if (error)
                        return alert(error.reason);
                });
            }
        }
        Router.go('/pseudoMenu');
    },

    'click #deleteOrder': function() {
        var delID = this._id;
        Meteor.call('deleteActiveOrder', delID, Meteor.user(), function(error, result) {
            if (error)
                return alert(error.reason);
        });
        var num = Local.find({
            userId: Meteor.user()._id
        }).count();
        if (num < 2) {
            Router.go('/pseudoMenu');

        }
    },

    "click #menu": function(evt, instance) {
        Router.go('/pseudoMenu#m');
    },

});
