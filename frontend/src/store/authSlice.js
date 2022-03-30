import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  user: null,
  otp: {
    phone: "",
    hash: "",
  },
};

// Redux have the actions, reducers this type of things but the redux toolkit is the short version of the redux
export const authSlice = createSlice({
  name: "auth",
  initialState,
  // we can not be able to change the state directly for change the state we are going to use this reducers or basically reducers functions
  // In normal redux the action and reducer are different
  reducers: {
    // first parameter is the state and the second parameter is the data
    setAuth: (state, action) => {
      // now after receiving the access set the isAuth to true
      const { user } = action.payload;
      // console.log(action.payload); // in invalid otp then did not come to this
      state.user = user;

      // if we logout the user then setting the redux store isAuth key to false so it can redirect user to directly home page
      if (user === null) {
        state.isAuth = false;
      } else {
        state.isAuth = true;
      }
    },
    setOtpKey: (state, action) => {
      // work here for change in the Otp object of the state
      // the data which we eneter in the dispatch call is come in the action.payload or normally says as the payload key of action object
      const { phone, hash } = action.payload;
      // console.log(state.otp); // This will give us a proxy

      // This will automaticlly change the state we did not have to copy and then make a object to change like in redux
      state.otp.phone = phone;
      state.otp.hash = hash;
    },
  },
});

// in redux toolkit the actions are generally reducers
// now we are exporting so that we can get this in our application where we wanted
export const { setAuth, setOtpKey } = authSlice.actions;

export default authSlice.reducer;
