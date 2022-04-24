import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice";
import activate from "./activateSlice";
import room from "./roomSlice";

export const store = configureStore({
  reducer: { auth, activate, room },
});
