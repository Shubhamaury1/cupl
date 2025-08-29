import { createSlice } from "@reduxjs/toolkit";
const CartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      //add item by button +
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        state.cart = state.cart.map((item) =>
          item.id === action.payload.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        state.cart.push(action.payload);
      }
      //end
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload.id);
    },

    incrementQty: (state, action) => {
      state.cart = state.cart.map((item) => 
        item.id === action.payload.id ? { ...item, qty: item.qty + 1 } : item
      );
    },
    decrementQty: (state, action) => {
        state.cart = state.cart.map((item) => 
          item.id === action.payload.id ? { ...item, qty: item.qty - 1 } : item
        );
    },
    clearCart: (state) => {
      state.cart = [];
    }
  },
});

export const { addToCart, removeFromCart, incrementQty, decrementQty, clearCart } =
  CartSlice.actions;
export default CartSlice.reducer;
