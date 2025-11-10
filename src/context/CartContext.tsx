
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

import type { MenuItem } from '../types/MenuItem';
import type { Promotion } from '../types/Promotion';
import * as promotionService from '../services/promotion.service';

export interface CartItem extends MenuItem {
    quantity: number;
}

type CartContextType = {
    items: CartItem[];
    drawerOpen: boolean;
    totalItems: number;
    totalPrice: number; // subtotal
    shippingFee: number;
    shippingThreshold: number;
    shippingFlat: number;
    appliedPromotion: Promotion | null;
    discountAmount: number;
    taxRate: number;
    taxAmount: number;
    grandTotal: number;
    addItem: (item: MenuItem, openDrawer?: boolean) => void;
    updateQuantity: (id: number, qty: number) => void;
    removeItem: (id: number) => void;
    applyPromotion: (code: string) => Promise<void>;
    removePromotion: () => void;
    openDrawer: () => void;
    closeDrawer: () => void;
};

// Tạo Context với giá trị mặc định null
const CartContext = createContext<CartContextType | null>(null);

// Provider
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(() => {
        try {
            const raw = localStorage.getItem('cart.appliedPromotion');
            return raw ? (JSON.parse(raw) as Promotion) : null;
        } catch {
            return null;
        }
    });

    // Shipping settings (tiered): free over threshold
    const shippingThreshold = 200000; // free if subtotal >= 200.000đ
    const shippingFlat = 20000; // otherwise flat 20.000đ

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

    // Discount from applied promotion (backend returns percentage 0-100)
    const discountAmount = appliedPromotion ? Math.round(totalPrice * (appliedPromotion.discount / 100)) : 0;

    // Shipping computed by tiered rule
    const shippingFee = totalPrice >= shippingThreshold ? 0 : (totalPrice === 0 ? 0 : shippingFlat);

    // Tax settings
    const taxRate = 0.1; // 10% VAT
    const taxableBase = Math.max(0, totalPrice - discountAmount);
    const taxAmount = Math.round(taxableBase * taxRate);

    // Grand total includes subtotal - discount + shipping + tax
    const grandTotal = Math.max(0, totalPrice - discountAmount + shippingFee + taxAmount);

    // Grand total after discount and shipping (does not include tax)
    // const grandTotal = Math.max(0, totalPrice - discountAmount + shippingFee);

    const applyPromotion = async (code: string) => {
        try {
            const promo = await promotionService.applyPromotionCode(code);
            setAppliedPromotion(promo);
            try {
                localStorage.setItem('cart.appliedPromotion', JSON.stringify(promo));
            } catch {
                // ignore localStorage write errors
            }
        } catch (err: any) {
            // Normalize backend error messages to user-friendly text
            const resp = err?.response;
            if (resp && resp.data) {
                // If backend provides a message, use it
                const msg = resp.data.message || resp.data.error || null;
                if (msg) throw new Error(String(msg));
            }

            // Map common HTTP statuses to messages
            const status = resp?.status;
            if (status === 404) throw new Error('Mã giảm giá không tồn tại');
            if (status === 410) throw new Error('Mã giảm giá đã hết hạn');
            if (status === 400) throw new Error('Mã giảm giá không hợp lệ');

            throw new Error('Không thể áp dụng mã giảm giá. Vui lòng thử lại');
        }
    };

    const removePromotion = () => {
        setAppliedPromotion(null);
        try {
            localStorage.removeItem('cart.appliedPromotion');
        } catch {
            // ignore
        }
    };

    return (
        <CartContext.Provider value={{
            items,
            drawerOpen,
            totalItems,
            totalPrice,
            shippingFee,
            shippingThreshold,
            shippingFlat,
            appliedPromotion,
            discountAmount,
            taxRate,
            taxAmount,
            grandTotal,
            addItem,
            updateQuantity,
            removeItem,
            applyPromotion,
            removePromotion,
            openDrawer: () => setDrawerOpen(true),
            closeDrawer: () => setDrawerOpen(false),
            // grandTotal is intentionally not exported separately to avoid duplicate naming; callers can compute if needed
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
