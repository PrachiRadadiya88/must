const nodemailer = require('nodemailer');
const otp=`${Math.floor(1000+Math.random()*9000)}`
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'harshilcbatch@gmail.com',
    pass: 'khcbecmhdnfbfzwt'
  }
});

const mailOptions = {
  from: 'harshilcbatch@gmail.com',
  to: 'radadiyaprachi048@gmail.com',
  subject: 'One Time Password',
  html:`<p>Enter <b>${otp}</b> in the app to verify your email address and complete the verfication</p><p>This code <b>Expires in 1 hour</b>.</p>`,
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
 console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
    // do something useful
  }
});