Template.about.events({
  "click #backBTN": function( evt, instance ){
    Router.go('menu');
  },

});

Template.about.helpers({
    appOn:function(){
		var app = Instance.findOne({name: "bandersnatch"}); 
		if(app.status == "on"){
			return true;
		}else{
			return false;
		}

    }
});