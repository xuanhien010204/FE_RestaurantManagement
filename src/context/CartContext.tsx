
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

import type { MenuItem } from '../types/MenuItem';

export interface CartItem extends MenuItem {
    quantity: number;
}

type CartContextType = {
    items: CartItem[];
    drawerOpen: boolean;
    totalItems: number;
    totalPrice: number;
    addItem: (item: MenuItem, openDrawer?: boolean) => void;
    updateQuantity: (id: number, qty: number) => void;
    removeItem: (id: number) => void;
    openDrawer: () => void;
    closeDrawer: () => void;
};

// Tạo Context với giá trị mặc định null
const CartContext = createContext<CartContextType | null>(null);

// Provider
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const addItem = (item: MenuItem, openDrawer = true) => {
        setItems(prev => {
            const exist = prev.find(p => p.id === item.id);
            if (exist) {
                return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        if (openDrawer) setDrawerOpen(true);
    };

    const updateQuantity = (id: number, qty: number) => {
        setItems(prev => {
            if (qty <= 0) return prev.filter(p => p.id !== id);
            return prev.map(p => p.id === id ? { ...p, quantity: qty } : p);
        });
    };

    const removeItem = (id: number) => setItems(prev => prev.filter(p => p.id !== id));

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    return (
        <CartContext.Provider value={{
            items,
            drawerOpen,
            totalItems,
            totalPrice,
            addItem,
            updateQuantity,
            removeItem,
            openDrawer: () => setDrawerOpen(true),
            closeDrawer: () => setDrawerOpen(false),
        }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook custom
export const useCart = (): CartContextType => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
