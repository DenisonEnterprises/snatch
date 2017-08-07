Meteor.subscribe('users');

Template.forgotField.rendered = function() {

    $('#signup-dnum').addClass("invalid");
    $('#signup-year').addClass("invalid");

    dFlag = false;
    yFlag = false;

    var dnumReg = Meteor.user().profile.dnum;
    var gradReg = Meteor.user().profile.classYear;
    if (dnumReg) {
        $("#signup-dnum").val(dnumReg);
        dFlag = true;
        $(".dnumCont").hide();
    }
    if (gradReg) {
        $("#signup-year").val(gradReg);
        yFlag = true;
        $(".gradYearCont").hide();
    }

    $('#signup-dnum').on('input', function() {
        var input = $(this).val();

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
            $(this).removeClass("invalid").addClass("valid");
        } else {
            $(this).removeClass("valid").addClass("invalid");
            if (dnumTaken) {
                $('#notif').html("D# Taken");
                document.getElementById('notif').style.opacity = '1.0'
                document.getElementById('notif').style.visibility = 'visible'
                setTimeout(function() {
                    $('#notif').animate({
                        opacity: 0
                    }, 1000, 'linear')
                }, 3000);
            } else if (!dnumNumber) {
                $('#notif').html("D# can only contain numbers");
                document.getElementById('notif').style.opacity = '1.0'
                document.getElementById('notif').style.visibility = 'visible'
                setTimeout(function() {
                    $('#notif').animate({
                        opacity: 0
                    }, 1000, 'linear')
                }, 3000);
            } else {
                $('#notif').html("Please Enter Your D#");
                document.getElementById('notif').style.opacity = '1.0'
                document.getElementById('notif').style.visibility = 'visible'
                setTimeout(function() {
                    $('#notif').animate({
                        opacity: 0
                    }, 1000, 'linear')
                }, 3000);
            }
        }
    });

    $('#signup-year').on('change', function(e) {
        if (e.target.value != "select") {
            yFlag = true;
            $(this).removeClass("invalid").addClass("valid");
        }
        else {
            yFlag = false;
            $(this).removeClass("valid").addClass("invalid");
        }
    });
};

Template.forgotField.events({
    "click #proceedButton": function(event, template) {
        event.preventDefault();
        if (yFlag && dFlag) {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {
                "profile.dnum": $("#signup-dnum").val(),
                "profile.classYear": $("#signup-year").val(),
            }});
        }
    }
});
