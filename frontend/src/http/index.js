import axios from "axios";

// Axios API is used only for the backend request and to get the data or response from the backend

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // now other domain can set cookies to this domain
  withCredentials: true,
  // now our cors issue comes again so i have to add a new field in the cors option in the backend with the name of credentials to true
  headers: {
    "content-type": "application/json",
    Accept: "application/json",
  },
});

// Listing all of the endpoints
// data contains only the phone
export const sendOtp = (data) => {
  return api.post("/api/send-otp", data);
};

// The data in verifyOtp request contain the phone, otp and hash
export const verifyOtp = (data) => {
  return api.post("/api/verify-otp", data);
};

// now our data contains the name and the base64 string of user Avatar image
export const activateUser = (data) => {
  return api.post("/api/activate", data);
};

// making Axios function to make request for the logout user
export const logoutUser = () => {
  // post request is some more secure
  return api.post("api/logout");
};

export const createRoom = (data) => {
  // obviously post request
  // we make the post request so it means we are going to create the room if we do get request on this url then it means we are going to get the all of the list of the rooms
  return api.post("api/rooms", data);
};

export const getAllPublicRooms = () => {
  // now we are using the same url which we used while creating the room but this time we are making get request not the post request
  return api.get("api/rooms");
};

// I am thinking why to make this getOneSingleRoom request to server else the response which we receive from the server while calling get all rooms we can use but we did not be able to use it because user can have private room also so the user have to get the information of private room also so we need a request which can do this.
// I am thinking of passing roomId as the url for the get request as a keyword or we use ? or something in our ecommerce project let's see
export const getSingleRoom = (roomId) => {
  // here we are dynamically plugging the roomid which i think to do it
  return api.get(`api/rooms/${roomId}`);
};

// Interceptors :- They sit between in every request and respone of the frontend request
// If our application is giving with 401 code which states that our accesstoken is expires so we are now going to hit the refresh endpoint and then again going to hit the same endpoint which gives us this error

// If the response is outside the 2xx codes then 2nd callback function or error callback function will run
// before sending response to the user we come back to this interceptor for every request
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      // we make it true so that it states that your refresh token is invalid
      originalRequest._isRetry = true;
      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/api/refresh`, {
          withCredentials: true,
        });

        return api.request(originalRequest);
      } catch (error) {
        console.log(error.message);
      }
    }

    throw error;
  }
);

export default api;

// A error can come with saying that cors not accessible something this is a standard error so add cors in the backend or use proxy in the frontend whatever  of your choice

// one error is coming because of my nodemon server is creshed so it take my time
// one more error of can't set headers is coming because i did not return from the function i simply write the res.send or res.json which is wrong so use the return res.json or return res.send

// .env file written also did not work out so i have to restart my react APP

// now when our access token expires a new access token is generated with help  of refresh token

// now on the page refresh we are generating new tokens both access and refresh which increased the security and this is known as refresh token rotation so the work will be done in the app.js because it is responsibe for the rendering of all of the components
