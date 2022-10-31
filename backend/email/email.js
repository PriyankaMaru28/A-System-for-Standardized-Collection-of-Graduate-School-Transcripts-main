var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'muncsgrad@gmail.com',
    pass: 'mungrad2020'
  }
});




function emailsend(email, subject , mailText){
    var mailOptions = {
        from: 'muncsgrad@gmail.com',
        to: email,
        subject: subject,
        text: mailText
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      //if (typeof callback == "function"){ callback(); }
     
     
}




module.exports = {emailsend}
