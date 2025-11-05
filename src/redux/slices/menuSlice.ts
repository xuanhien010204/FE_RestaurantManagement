import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MenuItem } from '../../types/MenuItem';

interface MenuState {
    items: MenuItem[];
    loading: boolean;
    error: string | null;
}

const initialState: MenuState = {
    items: [],
    loading: false,
    error: null,
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
            state.items = action.payload;
            state.loading = false;
            state.error = null;
        },
        addMenuItem: (state, action: PayloadAction<MenuItem>) => {
            state.items.unshift(action.payload);
        },
        updateMenuItem: (state, action: PayloadAction<MenuItem>) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        removeMenuItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
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
    setMenuItems,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
    setError,
    clearError
} = menuSlice.actions;
export default menuSlice;