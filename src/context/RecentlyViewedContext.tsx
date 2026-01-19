'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    imageUrl: string;
    category: string;
    slug: string;
}

interface RecentlyViewedContextType {
    recentlyViewed: Product[];
    addRecentlyViewed: (product: Product) => void;
    clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('recentlyViewed');
        if (stored) {
            try {
                setRecentlyViewed(JSON.parse(stored));
            } catch (error) {
                console.error('Error loading recently viewed:', error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
        }
    }, [recentlyViewed, isLoaded]);

    const addRecentlyViewed = (product: Product) => {
        setRecentlyViewed(prev => {
            // Remove if already exists
            const filtered = prev.filter(p => p._id !== product._id);
            // Add to beginning, limit to 10
            return [product, ...filtered].slice(0, 10);
        });
    };

    const clearRecentlyViewed = () => {
        setRecentlyViewed([]);
        localStorage.removeItem('recentlyViewed');
    };

    return (
        <RecentlyViewedContext.Provider value={{ recentlyViewed, addRecentlyViewed, clearRecentlyViewed }}>
            {children}
        </RecentlyViewedContext.Provider>
    );
}

export function useRecentlyViewed() {
    const context = useContext(RecentlyViewedContext);
    if (context === undefined) {
        throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
    }
    return context;
}
