const express = require("express");
const router = express.Router();
const authController = require("./controllers/auth-controller");
const activateController = require("./controllers/activate-controller");
const authMiddleware = require("./middlewares/auth-middleware");
const roomsController = require("./controllers/rooms-controller");

router.post("/api/send-otp", authController.sendOtp);
router.post("/api/verify-otp", authController.verifyOtp);

// so when we are sending this request then our payload is too big express allows us to make default request up to 100 kb if we have to increase the size of the request we have to incease it manually
// as we know that our this route is semi protected so we are adding middlewares before starting accessing this route
router.post("/api/activate", authMiddleware, activateController.activateUser);

// Now implementing the functionality of getting new access token if refresh token expires
router.get("/api/refresh", authController.refresh);

// Route for logout the user
router.post("/api/logout", authMiddleware, authController.logout);

// Route for creating a new room by using the post request of /api/rooms url
// we apply authMiddleware because only logged in user can access this route not anyone can access it
router.post("/api/rooms", authMiddleware, roomsController.createRoom);

// this is the route for the getting all the rooms by using the same url just using the get request else by using the post request
router.get("/api/rooms", authMiddleware, roomsController.getAllPublicRooms);

// In this way we get the dynamic roomId for every room and a dynamic url which will be automaticlly handled by the express.0
router.get("/api/rooms/:roomId", authMiddleware, roomsController.getSingleRoom);

module.exports = router;
