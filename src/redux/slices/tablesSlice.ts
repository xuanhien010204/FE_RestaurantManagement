import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RestaurantTable } from '../../types/RestaurantTable';

interface TablesState {
    items: RestaurantTable[];
    loading: boolean;
    error: string | null;
}

const initialState: TablesState = {
    items: [],
    loading: false,
    error: null,
};

const tablesSlice = createSlice({
    name: 'tables',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setTables: (state, action: PayloadAction<RestaurantTable[]>) => {
            state.items = action.payload;
            state.loading = false;
            state.error = null;
        },
        addTable: (state, action: PayloadAction<RestaurantTable>) => {
            state.items.unshift(action.payload);
        },
        updateTable: (state, action: PayloadAction<RestaurantTable>) => {
            const index = state.items.findIndex(table => table.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        removeTable: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(table => table.id !== action.payload);
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
    setTables,
    addTable,
    updateTable,
    removeTable,
    setError,
    clearError
} = tablesSlice.actions;
export default tablesSlice;