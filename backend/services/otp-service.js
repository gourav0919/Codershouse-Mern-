const crypto = require("crypto");
const accountSid = process.env.SMS_SID;
const authToken = process.env.SMS_AUTH_TOKEN;
const twilio = require("twilio");
const hashService = require("./hash-service");

class OtpService {
  // This is the method for generating the OTP
  async generateOtp() {
    const otp = crypto.randomInt(1000, 9999);
    return otp;
  }

  async sendOtpBySms(phone, otp) {
    // Twilio provide us a function which have 3 parameters first is Sid then authToken and then next is a object which is optional.
    const client = twilio(accountSid, authToken, {
      lazyLoading: true,
    });

    return await client.messages.create({
      to: phone,
      from: process.env.SMS_FROM_NUMBER,
      body: `Your OTP is ${otp}. Please verify it in 15 Minutes.`,
    });
  }

  async verifyHashedOtp(hashedOtp, data) {
    const computedHash = await hashService.hashOtp(data);

    return computedHash === hashedOtp;
  }
}

module.exports = new OtpService();
