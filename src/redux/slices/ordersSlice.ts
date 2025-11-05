import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Order } from '../../types/Order';

interface OrdersState {
    items: Order[];
    currentOrder: Order | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrdersState = {
    items: [],
    currentOrder: null,
    loading: false,
    error: null,
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setOrders: (state, action: PayloadAction<Order[]>) => {
            state.items = action.payload;
            state.loading = false;
            state.error = null;
        },
        setCurrentOrder: (state, action: PayloadAction<Order>) => {
            state.currentOrder = action.payload;
        },
        addOrder: (state, action: PayloadAction<Order>) => {
            state.items.unshift(action.payload);
        },
        updateOrder: (state, action: PayloadAction<Order>) => {
            const index = state.items.findIndex(order => order.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        removeOrder: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(order => order.id !== action.payload);
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setLoading,
    setOrders,
    setCurrentOrder,
    addOrder,
    updateOrder,
    removeOrder,
    setError,
    clearError
} = ordersSlice.actions;
export default ordersSlice;