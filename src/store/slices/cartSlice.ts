import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart', JSON.stringify(items));
};

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initCart(state) {
      state.items = loadCartFromStorage();
    },
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + action.payload.quantity, action.payload.stock);
      } else {
        state.items.push(action.payload);
      }
      saveCartToStorage(state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.productId !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find(i => i.productId === action.payload.productId);
      if (item) {
        item.quantity = Math.max(1, Math.min(action.payload.quantity, item.stock));
        saveCartToStorage(state.items);
      }
    },
    clearCart(state) {
      state.items = [];
      saveCartToStorage([]);
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
    openCart(state) {
      state.isOpen = true;
    },
    closeCart(state) {
      state.isOpen = false;
    },
  },
});

export const { initCart, addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart } =
  cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((acc, i) => acc + i.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
export const selectCartIsOpen = (state: { cart: CartState }) => state.cart.isOpen;

export default cartSlice.reducer;