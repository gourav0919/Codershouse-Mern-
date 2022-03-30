import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullName: "",
  avatar: "",
};

export const activateSlice = createSlice({
  name: "activate",
  initialState,
  reducers: {
    setFullNameKeyRedux: (state, action) => {
      state.fullName = action.payload;
    },
    setAvatarKeyRedux: (state, action) => {
      state.avatar = action.payload;
    },
  },
});

export const { setFullNameKeyRedux, setAvatarKeyRedux } = activateSlice.actions;

export default activateSlice.reducer;
