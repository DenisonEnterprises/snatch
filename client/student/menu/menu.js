Meteor.subscribe('local');

Template.menu.rendered = function() {
	
	
	

    var button = document.getElementById("cout");
   
    if (Local.find({userId: Meteor.user()._id}).count() === 0){
       button.disabled = true;
       button.style.opacity = "0.2";
       button.style.filter  = 'alpha(opacity=20)'; // IE fallback
       $("#cout").css("cursor", "default");
 
     }else{
        button.disabled = false;
        button.style.opacity = "1.0";
        button.style.filter  = 'alpha(opacity=100)'; // IE fallback
  	 }

 
    setTimeout(function(){

      var type = window.location.hash.substr(1);
      if (type === "u"){
          $("#notif").fadeIn(2000);
      }
 
    }, 500);
 
 
    setTimeout(function(){

      var type = window.location.hash.substr(1);
      if (type === "u"){
          $("#notif").fadeOut(2000);
      }
 
    }, 5000);

	
}


Template.menu.events({
  "click #bagelBTN": function( evt, instance ){
    Router.go('bagels');
  },
  
  "click #shakesBTN": function( evt, instance){
    Router.go('shakes');
  },
    "click #snackBTN": function( evt, instance ){
    Router.go('snacks');
  },
    "click #bevsBTN": function(evt, instance ){
    Router.go('beverages');
  },
    "click #cout": function(evt, instance){
      Router.go('/checkout');
    },
	
	"click #logout": function(evt, instance){
		Meteor.call("delLocalByUser");
		Meteor.logout();
		window.location.assign("/");
	}



	

  
});







 

