import { configureStore } from '@reduxjs/toolkit';
import { productReducer } from './productSlice.js';
import { categoryReducer } from './categorySlice.js';
import { cartReducer } from './cartSlice.js';
import { userReducer } from './userSlice.js';

export const store = configureStore({
    reducer: {
      product: productReducer,
      category: categoryReducer,
      cart: cartReducer,
      user: userReducer
    }
  })