Meteor.subscribe('orderList');

Template.orderList.events({
  "click #swapBTN": function(evt, instance ){
    Router.go('employee');
  },
});