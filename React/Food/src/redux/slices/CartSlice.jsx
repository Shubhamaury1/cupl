// import { createSlice } from "@reduxjs/toolkit";
// // Load cart from localStorage when the app starts
// const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

// const CartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     cart: storedCart, // ← use stored cart if available
//   },
//   reducers: {
//     addToCart: (state, action) => {
//       // Add item or increase quantity
//       const existingItem = state.cart.find(
//         (item) => item.id === action.payload.id
//       );
//       if (existingItem) {
//         state.cart = state.cart.map((item) =>
//           item.id === action.payload.id
//             ? { ...item, PQunatity: item.PQunatity + 1 }
//             : item
//         );
//       } else {
//         state.cart.push(action.payload);
//       }

//       //Save to localStorage
//       localStorage.setItem("cartItems", JSON.stringify(state.cart));
//     },

//     removeFromCart: (state, action) => {
//       state.cart = state.cart.filter((item) => item.id !== action.payload.id);

//       // Update localStorage
//       localStorage.setItem("cartItems", JSON.stringify(state.cart));
//     },

//     incrementQty: (state, action) => {
//       state.cart = state.cart.map((item) =>
//         item.id === action.payload.id
//           ? { ...item, PQunatity: item.PQunatity + 1 }
//           : item
//       );

//       //Update localStorage
//       localStorage.setItem("cartItems", JSON.stringify(state.cart));
//     },

//     decrementQty: (state, action) => {
//       state.cart = state.cart.map((item) =>
//         item.id === action.payload.id && item.PQunatity > 1
//           ? { ...item, PQunatity: item.PQunatity - 1 }
//           : item
//       );

//       // Update localStorage
//       localStorage.setItem("cartItems", JSON.stringify(state.cart));
//     },

//     clearCart: (state) => {
//       state.cart = [];
//       localStorage.removeItem("cartItems"); // Clear localStorage
//     },
//   },
// });

// export const {
//   addToCart,
//   removeFromCart,
//   incrementQty,
//   decrementQty,
//   clearCart,
// } = CartSlice.actions;

// export default CartSlice.reducer;





import { createSlice } from "@reduxjs/toolkit";

// cart for the logged-in user
const getCartFromLocalStorage = () => {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const decoded = JSON.parse(atob(token.split(".")[1])); // simple JWT decode
    const username = decoded.username;
    return JSON.parse(localStorage.getItem(`cartItems_${username}`)) || [];
  } catch (error) {
    console.error("Error decoding token:", error);
    return [];
  }
};

const CartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: getCartFromLocalStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const username = decoded.username;

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

      localStorage.setItem(`cartItems_${username}`, JSON.stringify(state.cart));
    },

    removeFromCart: (state, action) => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const username = decoded.username;

      state.cart = state.cart.filter((item) => item.id !== action.payload.id);

      localStorage.setItem(`cartItems_${username}`, JSON.stringify(state.cart));
    },

    incrementQty: (state, action) => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const username = decoded.username;

      state.cart = state.cart.map((item) =>
        item.id === action.payload.id
          ? { ...item, PQunatity: item.PQunatity + 1 }
          : item
      );

      localStorage.setItem(`cartItems_${username}`, JSON.stringify(state.cart));
    },

    decrementQty: (state, action) => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const username = decoded.username;

      state.cart = state.cart.map((item) =>
        item.id === action.payload.id && item.PQunatity > 1
          ? { ...item, PQunatity: item.PQunatity - 1 }
          : item
      );

      localStorage.setItem(`cartItems_${username}`, JSON.stringify(state.cart));
    },

    clearCart: (state) => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const username = decoded.username;

      state.cart = [];
      localStorage.removeItem(`cartItems_${username}`);
    },

    setCart: (state, action) => {
      // Useful for loading cart after login
      state.cart = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQty,
  decrementQty,
  clearCart,
  setCart,
} = CartSlice.actions;

export default CartSlice.reducer;
