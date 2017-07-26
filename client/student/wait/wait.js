Meteor.subscribe('active');
Meteor.subscribe('ready');
Meteor.subscribe('finished');

Template.orderInfoClient.helpers({
    'order': function() {
        return ActiveOrders.find().fetch();
    },

    'shakey': function() {
        return this.item == "Shake: ";
    },
});

Template.order3Client.helpers({
    'orderTime': function() {
        var time = this.start;
        if (time.getHours() >= 12 && time.getHours() < 24) {
            if (time.getHours() == 12) {
                return '12' + ":" + ("0" + time.getMinutes()).slice(-2) + " PM"; //PM
            } else {
                return (time.getHours() - 12) + ":" + ("0" + time.getMinutes()).slice(-2) + " PM"; //PM
            }
        } else {
            if (time.getHours() == 0) {
                return '12' + ":" + ("0" + time.getMinutes()).slice(-2) + " AM"; //AM
            } else {
                return time.getHours() + ":" + ("0" + time.getMinutes()).slice(-2) + " AM"; //AM
            }
        }
    }
});

Template.order2Client.helpers({
    'orderDeets': function() {
        return this.item;
    },
});

Template.addInClient.helpers({
    'info': function() {
        var str = '';
        var i = 0;
        if (this.flavor != null) {
            str = '\n\t' + this.flavor;
            if (this.mixin != '') {
                str += "\n\t" + this.mixin;
            }
        }
        return str;
    },

});

Template.wait.events({
    "click #back": function(evt, instance) {
        Router.go('menu');
    },
});
