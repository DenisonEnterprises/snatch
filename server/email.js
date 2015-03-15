Meteor.startup(function () {
 
    
  
  //process.env.MAIL_URL = 'smtp://postmaster%40mg.bandersnatchapp.com:7c404250e5bd113160c73c072d5302ef@smtp.mailgun.org:587';
  process.env.MAIL_URL = 'smtp://postmaster%40sandboxfcd2843bbbf94d548727db6e5c49d042.mailgun.org:5363348933de6527c476fc95aee0052a@smtp.mailgun.org:587';
  //sandboxfcd2843bbbf94d548727db6e5c49d042.mailgun.org
  
// By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
  Accounts.emailTemplates.from = 'Bandersnatch App <bandersnatchApp@gmail.com>';

  // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
  Accounts.emailTemplates.siteName = 'Bandersnatch App';

  // A Function that takes a user object and returns a String for the subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Bandersnatch App - Confirm Your Email Address';
  };

  // A Function that takes a user object and a url, and returns the body text for the email.
  // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return 'Hello ' + user.username + '!\n\nClick on the following link to verify your email address: \n' + url + '\n\nThank You!\nThe Bandersnatch Dev Team';
  };


});


Accounts.onCreateUser(function(options, user) {  
  // we wait for Meteor to create the user before sending an email
  Meteor.setTimeout(function() {
    Accounts.sendVerificationEmail(user._id);
  }, 2 * 1000);

  if (options.profile)
        user.profile = options.profile;
  
  return user;
});

//DONT NEED BELOW ---- CANT BE A STUDENT UNLESS VERIFIED AND STUDENT LOCKS THEM OUT
// (server-side) called whenever a login is attempted
/*
Accounts.validateLoginAttempt(function(attempt){
  if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified ) {
    console.log('email not verified');

    return false; // the login is aborted
  }
  return true;
}); 
*/