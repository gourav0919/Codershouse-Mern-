const crypto = require("crypto");

class HashService {
  // The data parameter must be in string
  async hashOtp(data) {
    //   The difference between hash and hmac is that in hmac you can provide a security key which assures that the data is not changed intentionally or accidentally
    // if we change the secret key and data then hash will be changed or anyone of them
    const hashedData = crypto
      .createHmac("sha256", process.env.HASH_SECRET)
      .update(data)
      .digest("hex");
    return hashedData;
  }
}

module.exports = new HashService();



