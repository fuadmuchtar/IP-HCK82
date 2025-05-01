import { configureStore } from '@reduxjs/toolkit';
import { productReducer } from './productSlice.js';
import { categoryReducer } from './categorySlice.js';

export const store = configureStore({
    reducer: {
      product: productReducer,
      category: categoryReducer
    }
  })