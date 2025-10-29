import { createSlice } from "@reduxjs/toolkit";
// Load cart from localStorage when the app starts
const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

const CartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: storedCart, // ← use stored cart if available
  },
  reducers: {
    addToCart: (state, action) => {
      // Add item or increase quantity
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        state.cart = state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, PQunatity: item.PQunatity + 1 }
            : item
        );
      } else {
        state.cart.push(action.payload);
      }

      //Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload.id);

      // Update localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },

    incrementQty: (state, action) => {
      state.cart = state.cart.map((item) =>
        item.id === action.payload.id
          ? { ...item, PQunatity: item.PQunatity + 1 }
          : item
      );

      //Update localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },

    decrementQty: (state, action) => {
      state.cart = state.cart.map((item) =>
        item.id === action.payload.id && item.PQunatity > 1
          ? { ...item, PQunatity: item.PQunatity - 1 }
          : item
      );

      // Update localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },

    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem("cartItems"); // Clear localStorage
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQty,
  decrementQty,
  clearCart,
} = CartSlice.actions;

export default CartSlice.reducer;
