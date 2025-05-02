import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

const productSlice = createSlice({
  name: "product",
  initialState: {
    items: [],
    loading: false,
    error: "",
  },
  reducers: {
    fetchProductStart(state) {
      state.loading = true
      state.error = ''
    },
    fetchProductSuccess(state, action) {
      state.loading = false
      state.items = action.payload
    },
    fetchProductError(state, action) {
      state.loading = false
      state.error = action.payload?.message
    },
  }
})

export const productReducer = productSlice.reducer

export const { fetchProductSuccess, fetchProductStart, fetchProductError } = productSlice.actions

export const fetchProducts = createAsyncThunk('product/fetchProducts', async (payload, { dispatch }) => {
  try {
    dispatch(fetchProductStart())

    const { data } = await Axios({
      method: "GET",
      url: `http://localhost:3000/products`,
      params: payload
    });

    dispatch(fetchProductSuccess(data))
  } catch (error) {
    dispatch(fetchProductError(error.response?.data?.message))
  }
})
