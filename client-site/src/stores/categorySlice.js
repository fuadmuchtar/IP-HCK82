import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    items: [],
    loading: false,
    error: "",
  },
  reducers: {
    fetchCategoryStart(state) {
      state.loading = true
      state.error = ''
    },
    fetchCategorySuccess(state, action) {
      state.loading = false
      state.items = action.payload
    },
    fetchCategoryError(state, action) {
      state.loading = false
      state.error = action.payload?.message
    },
  }
})

export const categoryReducer = categorySlice.reducer

export const { fetchCategorySuccess, fetchCategoryStart, fetchCategoryError } = categorySlice.actions

export const fetchCategories = createAsyncThunk('category/fetchCategories', async (payload, { dispatch }) => {
  try {
    dispatch(fetchCategoryStart())

    const { data } = await Axios({
      method: "GET",
      url: `http://localhost:3000/categories`,
    });

    dispatch(fetchCategorySuccess(data))
  } catch (error) {
    dispatch(fetchCategoryError(error.response?.data?.message))
  }
})

// create async action
// update async action
// delete async action
