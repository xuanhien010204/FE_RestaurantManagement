import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import ordersSlice from './slices/ordersSlice';
import paymentsSlice from './slices/paymentsSlice';
import menuSlice from './slices/menuSlice';
import tablesSlice from './slices/tablesSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        orders: ordersSlice.reducer,
        payments: paymentsSlice.reducer,
        menu: menuSlice.reducer,
        tables: tablesSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;