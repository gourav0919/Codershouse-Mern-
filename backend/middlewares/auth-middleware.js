// middlewares are nothing they are just functions which sit between the req and response and work as a check for which request is passed and which not

const tokenService = require("../services/token-service");

// authMiddleware is used for checking the routes for verifying that only the logged in user or authenticated user can access this route
const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      // console.log(
      //   "Throwing Error because of not availability of access Token."
      // );
      throw new Error();
    }

    const userData = await tokenService.verifyAccessToken(accessToken);
    // in any case like token got expires if error occures then it is going to resolve in the catch block
    // console.log(userData); // now we are going to receive the user id and activated : false

    if (!userData) {
      throw new Error(); // inbuilt javascript error function
    }
    req.user = userData;

    next(); // proceed the request
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = authMiddleware;
