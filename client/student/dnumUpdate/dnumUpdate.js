Meteor.subscribe("users");

Template.dnumUpdateForm.events({
    "submit #dnumForm": function(event, template) {

        event.preventDefault();

        var input = $($('#dnum-update')).val();

        var dnumTaken = Meteor.users.find({
            "profile.dnum": input
        }).count() > 0;
        var dnumEmpty = input.length === 0;
        var dnumNumber = true;

        good_dnum = input.replace(/(\s*)(D|d|0)?(\d{8})(.*)/, 'D$3');

        if (good_dnum.length == 9) {
            dnumNumber = true;
        } else {
            dnumNumber = false;
        }

        dFlag = !dnumTaken && !dnumEmpty && dnumNumber;
        if (dFlag) {
            Meteor.users.update({
                _id: Meteor.user()._id
            }, {
                $set: {
                    "profile.dnum": good_dnum
                }
            });
            Router.go('/checkout');
        } else {
            $(this).removeClass("valid").addClass("invalid");
            if (dnumTaken) {
                $('#notif').html("D# Taken");
                document.getElementById('notif').style.opacity = '1.0'
                document.getElementById('notif').style.visibility = 'visible'
            } else if (!dnumNumber) {
                $('#notif').html("D# can only contain numbers");
                document.getElementById('notif').style.opacity = '1.0'
                document.getElementById('notif').style.visibility = 'visible'
            } else {
                $('#notif').html("Please Enter Your D#");
                document.getElementById('notif').style.opacity = '1.0'
                document.getElementById('notif').style.visibility = 'visible'
            }
        }
        setTimeout(function() {
            $('#notif').animate({
                opacity: 0
            }, 1000, 'linear')
        }, 3000);
    }
});
