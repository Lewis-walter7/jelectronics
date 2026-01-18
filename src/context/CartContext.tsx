'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    variant?: string;
    color?: string;
};

type CartContextType = {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeFromCart: (id: string, variant?: string, color?: string) => void;
    totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex((i) =>
                i.id === newItem.id &&
                i.variant === newItem.variant &&
                i.color === newItem.color
            );

            const qtyToAdd = newItem.quantity || 1;

            if (existingIndex > -1) {
                const newItems = [...prev];
                newItems[existingIndex] = {
                    ...newItems[existingIndex],
                    quantity: newItems[existingIndex].quantity + qtyToAdd
                };
                return newItems;
            }
            return [...prev, { ...newItem, quantity: qtyToAdd }];
        });
    };

    const removeFromCart = (id: string, variant?: string, color?: string) => {
        setItems((prev) => prev.filter((i) => !(i.id === id && i.variant === variant && i.color === color)));
    };

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, totalItems }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
