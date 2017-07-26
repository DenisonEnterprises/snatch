Meteor.subscribe('users');

Template.forgot.events({
    "click #back": function(evt, instance) {
        $('#notif').hide();
        Router.go('/');
    },

    "click #submit": function(event, template) {
        event.preventDefault();
        var input = $($('#email')).val();
        var emailExists = Meteor.users.find({
            'profile.du': input
        }).count() > 0;
        document.getElementById('notif').style.opacity = '1.0'
        document.getElementById('notif').style.visibility = 'visible'
        if (emailExists) {
            Accounts.forgotPassword({
                email: input
            }, function(err) {
                if (err) {
                    $('#notif').html("An Unknown Error Occurred - Please Try Again.");
                } else {
                    $('#notif').html("Email Sent");
                }
            });
        } else {
            $('#notif').html("Invalid Email");
        }
        setTimeout(function() {
            $('#notif').animate({
                opacity: 0
            }, 1000, 'linear')
        }, 3000);
    },
});
