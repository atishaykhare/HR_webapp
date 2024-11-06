import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const setAuth = createAsyncThunk('auth/setSignUp', async (data, { dispatch, getState }) => {
  return data;
});

const initialState = {
  data: {},
  isLoading: false,
  isSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedOut: (state, action) => initialState,
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSuccess: (state, action) => {
      state.isSuccess = action.payload;
    },
  },
  extraReducers: {
    [setAuth.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setLoading, setSuccess } = authSlice.actions;
export const selectAuthStatus = ({ auth }) => auth.isSuccess;
export const selectAuthLoading = ({ auth }) => auth.isLoading;

export default authSlice.reducer;
