const otpGenerator = require('otp-generator');

module.exports.generateOTP = () => {
  const OTP = otpGenerator.generate(4,OTP_CONFIG);
  return OTP;
};

// The OTP_LENGTH is a number, For my app i selected 10.
// The OTP_CONFIG is an object that looks like 
OTP_CONFIG: {
  upperCaseAlphabets: true;
  specialChars: false;
};