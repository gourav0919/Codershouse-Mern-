const otpService = require("../services/otp-service"); // here we import the object of otpService class and directly able to call the methods of this object so in this way all of the files where we import the otpservice now share the same memory
const hashService = require("../services/hash-service");
const userService = require("../services/user-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dtos/user-dto");

class AuthController {
  async sendOtp(req, res) {
    // In this controller we are writing our logic for the specific route
    // getting phone key from the req.body object
    const { phone } = req.body;

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Enter Phone Number in field" });
    }

    // The logic of the controller is generally going to be written in the services we are trying to implement the MVC Controller

    // Generating the otp via the service
    // const otp = await otpService.generateOtp();
    const otp = 9999; // Static otp

    // hashing the data via the service
    const timeToLeave = 1000 * 60 * 15; // 15 minutes
    const expiresIn = Date.now() + timeToLeave;
    const data = `${phone}.${otp}.${expiresIn}`;
    const hashedOtp = await hashService.hashOtp(data);

    // now at this time we hashed our data now its the time to send the otp to our user
    try {
      // await otpService.sendOtpBySms(phone, otp);
      return res.status(200).json({
        success: true,
        hash: `${hashedOtp}.${expiresIn}`,
        phone,
        otp,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Some internal server error occured",
        error,
      });
    }
  }

  // function or method to verify the otp
  async verifyOtp(req, res) {
    // We receive otp, phone and hash which we sent to user at the time of send otp
    const { otp, hash, phone } = req.body;

    // If anyone of them is not received simply return it with a invalid request response and a message
    if (!otp || !hash || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are Required.",
      });
    }

    // As you remember at the time of response from send otp by sms you get a string 2 things one is hashedData and second is expires time with a gap of . so now we split the hashedData or expires time.
    const [hashedOtp, expiresIn] = hash.split(".");

    // If time Expires then return with a response code of 408 and a message that says otp is expired. As we know that the expiresIn we receive is string then by using the unary operator we can convert a string to the number this is also known as the explicitly conversion
    if (+expiresIn < Date.now()) {
      return res.status(408).json({
        success: false,
        message: "OTP is Expired.",
      });
    }

    // As we know that our data which is hashed is form of 3 things one is phone, second is otp and third is expiresIn
    // why we add the expires because at the time of verifcation if anyone change the expires then we can not be able to match the hash so in this way we can be able to secure our app
    const data = `${phone}.${otp}.${expiresIn}`;

    // Calling verifyHashedOtp service to check whether the hashedOtp and our Data which we enter in the request body matches
    const isValid = await otpService.verifyHashedOtp(hashedOtp, data);

    // If that is not matches then response them with an error code of unauthorised and by saying a message of invalid credentials
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Please Input Valid Credentials.",
      });
    }

    // now we have to generate the user, Access Token and the Refresh token
    let user;
    try {
      user = await userService.findUser({ phone });
      if (!user) {
        user = await userService.createUser({ phone });
      }
      // we did not have to do this because if user is exist then simply login them
      // else {
      //   res.status(409).json({
      //     success: false,
      //     message: "User Already Exist with given Credentials.",
      //   });
      // }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Some internal server error occured",
        error,
      });
    }

    // We did not have the session because we have the frontend and backend different so we are using token
    const { accessToken, refreshToken } = tokenService.generateTokens({
      id: user._id,
    });

    // before storing the refresh token to the cookies pls add it to database first
    await tokenService.storeRefreshToken(refreshToken, user._id);

    // Now we are storing our token in the cookies of http only so that user can not be able to access it
    // now the browser automaticlly send the cookies to the server with every http request so we did not have to manually send it
    // but we are using a bit different using local storage and cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expires: new Date(
        //   Cookie Expire is in days so we convert it in milliseconds to add it to date
        Date.now() + +process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
    });
    // Saving our AccessToken in the Cookies so that it is saved from the Attack and set http only to true
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      expires: new Date(
        //   we convert it in milliseconds to add it to date
        Date.now() + 24 * 60 * 60 * 1000
      ),
    });

    // making an instance or object of UserDto class
    const userDto = new UserDto(user);
    // now our userDto have the some properties of our user object which we receive from the database
    //
    return res.status(200).json({ success: true, user: userDto });

    // now we make the authentication without even storing it in the database so in this way we reduce the load of our database.
  }

  async refresh(req, res) {
    // get refresh token from cookies
    const { refreshToken: refreshTokenFromCookies } = req.cookies; // using cookie parser
    // if we are making the request for the first time like in the first user interaction
    if (!refreshTokenFromCookies) {
      return res.status(400).json({
        success: false,
        message: "Invalid Request.",
      });
    }

    let decodedUserData;
    // check if token is valid
    try {
      decodedUserData = await tokenService.verifyRefreshToken(
        refreshTokenFromCookies
      );
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    // checking of token if it is present in database or not
    try {
      const token = await tokenService.findRefreshToken(
        decodedUserData.id,
        refreshTokenFromCookies
      );

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Invalid or Token not Found.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Database Error",
      });
    }

    // check if valid user it means if the token is present in the refresh model but the user with that id is not present in the user collection then it is a problem
    const userValid = await userService.findUser({ _id: decodedUserData.id });
    if (!userValid) {
      return res.status(404).json({
        success: false,
        message: "User with Given Credentials is not found in Database.",
      });
    }

    // generating new tokens both
    const { refreshToken, accessToken } = tokenService.generateTokens({
      id: userValid._id,
    });

    // After generating store the refresh Token in the database
    try {
      await tokenService.updateRefreshToken(refreshToken, userValid._id);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Database Error",
      });
    }

    // put in cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expires: new Date(
        //   Cookie Expire is in days so we convert it in milliseconds to add it to date
        Date.now() + +process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      expires: new Date(
        //   we convert it in milliseconds to add it to date
        Date.now() + 24 * 60 * 60 * 1000
      ),
    });

    // response to user
    const userDto = new UserDto(userValid);
    return res.status(200).json({ success: true, user: userDto });
  }

  async logout(req, res) {
    const { refreshToken } = req.cookies;

    // delete refresh token from the db
    try {
      await tokenService.deleteRefreshToken(refreshToken);
    } catch (error) {
      console.log(error);
    }

    // clear the cookies of accessToken and refreshToken in the cookies to empty
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.status(200).json({ user: null, auth: false, success: true });
  }
}

// if we did not want to send the same values which we receive from  the database to the client so for handling this type of tasks we use the dtos data transfer objects

// This is known as the singleton export which send the same object every time.
module.exports = new AuthController();

// error can come then go to the cookies and clear it when you are on the home page and logout if cookies is present then clear the cookies then start the work
// This is not the problem in one response i did not return the values thats why this error is coming so there is no need to clear the cookies now
