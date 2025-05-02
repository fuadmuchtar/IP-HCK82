import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import Swal from "sweetalert2";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
        error: "",
    },
    reducers: {
        fetchCartStart(state) {
            state.loading = true
            state.error = ''
        },
        fetchCartSuccess(state, action) {
            state.loading = false
            state.items = action.payload
        },
        fetchCartError(state, action) {
            state.loading = false
            state.error = action.payload?.message
        },
    }
})

export const cartReducer = cartSlice.reducer

export const { fetchCartSuccess, fetchCartStart, fetchCartError } = cartSlice.actions

export const fetchCarts = createAsyncThunk('cart/fetchCarts', async (payload, { dispatch }) => {
    try {
        dispatch(fetchCartStart())

        const { data } = await Axios({
            method: "GET",
            url: `http://localhost:3000/cart`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        dispatch(fetchCartSuccess(data))
    } catch (error) {
        dispatch(fetchCartError(error.response?.data))
    }
})

export const addToCart = createAsyncThunk('cart/addToCart', async (payload, { dispatch }) => {
    try {
        dispatch(fetchCartStart())

        const { data } = await Axios({
            method: "POST",
            url: `http://localhost:3000/products/${payload}/add`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Produk berhasil ditambahkan ke keranjang',
        })
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Maaf, kamu belum login',
            text: 'Silahkan login terlebih dahulu untuk menambahkan produk ke keranjang',
        })
        dispatch(fetchCartError(error.response?.data))
    }
})

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (payload, { dispatch }) => {
    try {
        dispatch(fetchCartStart())

        const { data } = await Axios({
            method: "DELETE",
            url: `http://localhost:3000/cart/${payload}/delete`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Produk berhasil dihapus dari keranjang',
        })
    } catch (error) {
        console.log(error)
        dispatch(fetchCartError(error.response?.data))
    }
})

// create async action
// update async action
// delete async action
