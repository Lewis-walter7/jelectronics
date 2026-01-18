'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Minimal product type for the context
export interface CompareItem {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
    slug: string;
}

interface CompareContextType {
    compareList: CompareItem[];
    addToCompare: (product: CompareItem) => void;
    removeFromCompare: (productId: string) => void;
    clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
    const [compareList, setCompareList] = useState<CompareItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('compareList');
        if (saved) {
            try {
                setCompareList(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse compare list', e);
            }
        }
    }, []);

    // Save to localStorage whenever list changes
    useEffect(() => {
        localStorage.setItem('compareList', JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (product: CompareItem) => {
        setCompareList((prev) => {
            // Prevent duplicates
            if (prev.find(item => item._id === product._id)) return prev;
            // Limit to 3 items
            if (prev.length >= 3) {
                alert('You can compare a maximum of 3 products at a time.');
                return prev;
            }
            return [...prev, product];
        });
    };

    const removeFromCompare = (productId: string) => {
        setCompareList((prev) => prev.filter((item) => item._id !== productId));
    };

    const clearCompare = () => {
        setCompareList([]);
    };

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (context === undefined) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
}
