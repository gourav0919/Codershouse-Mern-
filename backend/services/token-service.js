const jwt = require("jsonwebtoken");
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const RefreshTokenModel = require("../models/refresh-model");

class TokenService {
  // payload will be look like this {   id: user._id,  }
  generateTokens(payload) {
    //   The time for the access token is to be as less as you can for the security purposes like banks have it for only 2-5 minutes or less
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      // expiresIn: "1h",
      expiresIn: "1m", // set it to 1 minute for the testing purposes
    });

    // This is used for creating the accessToken again and again for the user in the backend so that the user can not have to login again and again it make our system more secure
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "1y",
    });

    return { accessToken, refreshToken };
  }

  async storeRefreshToken(refreshToken, userId) {
    try {
      RefreshTokenModel.create({
        token: refreshToken,
        userId,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // we made it async so that it return an promise if it is not resolved then it is the error that occur in it
  async verifyAccessToken(token) {
    return jwt.verify(token, accessTokenSecret);
  }

  async verifyRefreshToken(token) {
    return jwt.verify(token, refreshTokenSecret);
  }

  // for finding the refresh Token from its collection
  async findRefreshToken(userId, refreshToken) {
    return await RefreshTokenModel.findOne({
      userId,
      token: refreshToken,
    });
  }

  async updateRefreshToken(refreshToken, userId) {
    await RefreshTokenModel.updateOne(
      {
        userId,
      },
      { token: refreshToken }
    );
  }

  async deleteRefreshToken(refreshToken) {
    return await RefreshTokenModel.deleteOne({ token: refreshToken });
  }
}

module.exports = new TokenService();
