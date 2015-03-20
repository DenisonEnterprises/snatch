Meteor.subscribe('milkshakes');
Template.shakes.events({
  "click #bagelBTN": function( evt, instance ){
    Router.go('bagels');
  },
  
  "click #snackBTN": function( evt, instance){
    Router.go('snacks');
  },
    "click #backBTN": function( evt, instance ){
    Router.go('menu');
  },
    "click #bevsBTN": function(evt, instance ){
    Router.go('beverages');
  },
    "click #logout": function(ev, instance){
		Meteor.call("delLocalByUser");
		Meteor.logout();
		window.location.assign("/");
  },
  
});


Template.shakes.helpers({
  
  'flavor': function(){
    return Milkshakes.find({type: 'flavor'}).fetch();
  },
  
  'mixin': function(){
    return Milkshakes.find({type: 'mixin'}).fetch();
  }, 
  
});

Template.shakes.events({
  
  'submit form': function(event) {
    event.preventDefault();
    var flavor;
    var form = {};
    var price; 
    
    $.each($('#flavor_list').serializeArray(),function(){
      flavor = this.name + "\n";
      price = "$" + this.value;
    });
    $.each($('#mixin_list').serializeArray(),function(){
      form[this.name] = this.name;
/*      if(price == NULL){
      		price = "$" + this.value;
      }*/
    });
  
    var mixinStr = ""
    for (var shit in form){
      mixinStr = mixinStr + form[shit] + "\n";
      }
    
      Meteor.call('shakeOrder',mixinStr, flavor, price,function(error,result) {
        if (error)
          return alert(error.reason);
      });
    
    Router.go('/menu#u');
  }
});
    

Template.flavorBox.helpers({
  'flavorName': function(){
    return this.name;
  }
});

Template.mixinBox.helpers({
  'mixinName': function(){
    return this.name;
  }
});

Template.flavorBox.events({
    'click': (function(event) {
      var elements = document.getElementsByName('flavor');
      var i = 0; 
      while (i < 3 && elements[i].checked){
        if(elements[i].checked){
          console.log("checkmate");
        }
        i = i+1;
      }
      /*
      for (var i = 0, l = 3 ; i < l ; i++) {
       // console.log("Congrats on a fucking flavor");
        if (elements[i].checked) {
          //console.log("Congrats on a fucking flavor"); 
        }
      }*/
  }),
});


Template.mixinBox.events({
    'click': function(event) {
      var elements = document.getElementsByName('mixin');
      for (var i = 0,l=4;i<l;i++) {
        if (elements[i].checked) {
        }
      }
  },
});


