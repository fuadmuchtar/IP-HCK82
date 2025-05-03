import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    items: [],
    loading: false,
    error: "",
  },
  reducers: {
    fetchUserStart(state) {
      state.loading = true
      state.error = ''
    },
    fetchUserSuccess(state, action) {
      state.loading = false
      state.items = action.payload
    },
    fetchUserError(state, action) {
      state.loading = false
      state.error = action.payload?.message
    },
  }
})

export const userReducer = userSlice.reducer

export const { fetchUserSuccess, fetchUserStart, fetchUserError } = userSlice.actions

export const fetchUser = createAsyncThunk('user/fetchUser', async (payload, { dispatch }) => {
  try {
    dispatch(fetchUserStart())

    const { data } = await Axios({
      method: "GET",
      url: `https://p2-ip.bebrave.cloud/profile`,
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        }
    });

    dispatch(fetchUserSuccess(data))
  } catch (error) {
    dispatch(fetchUserError(error.response?.data?.message))
  }
})

export const updateUser = createAsyncThunk('user/updateUser', async (payload, { dispatch }) => {
  try {
    dispatch(fetchUserStart())

    const { data } = await Axios({
      method: "PUT",
      url: `https://p2-ip.bebrave.cloud/profile/update`,
      data: payload,
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        }
    });

    dispatch(fetchUserSuccess(data))
  } catch (error) {
    dispatch(fetchUserError(error.response?.data?.message))
  }
})