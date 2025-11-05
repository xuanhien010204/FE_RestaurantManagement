import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Payment } from '../../types/Payment';

interface PaymentStatistics {
    totalCompleted: number;
    totalPending: number;
    totalFailed: number;
    countCompleted: number;
    countPending: number;
    countFailed: number;
    totalRevenue: number;
    generatedAt: string;
}

interface PaymentsState {
    items: Payment[];
    statistics: PaymentStatistics | null;
    loading: boolean;
    error: string | null;
}

const initialState: PaymentsState = {
    items: [],
    statistics: null,
    loading: false,
    error: null,
};

const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setPayments: (state, action: PayloadAction<Payment[]>) => {
            state.items = action.payload;
            state.loading = false;
            state.error = null;
        },
        setStatistics: (state, action: PayloadAction<PaymentStatistics>) => {
            state.statistics = action.payload;
        },
        addPayment: (state, action: PayloadAction<Payment>) => {
            state.items.unshift(action.payload);
        },
        updatePayment: (state, action: PayloadAction<Payment>) => {
            const index = state.items.findIndex(payment => payment.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        removePayment: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(payment => payment.id !== action.payload);
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
    setPayments,
    setStatistics,
    addPayment,
    updatePayment,
    removePayment,
    setError,
    clearError
} = paymentsSlice.actions;
export default paymentsSlice;