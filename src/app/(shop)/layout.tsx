import Navbar from '@/components/layout/Navbar';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { CompareProvider } from '@/context/CompareContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { RecentlyViewedProvider } from '@/context/RecentlyViewedContext';
import ComparisonFloatingBar from '@/components/product/ComparisonFloatingBar';

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <WishlistProvider>
            <CartProvider>
                <CompareProvider>
                    <RecentlyViewedProvider>
                        <Navbar />
                        <CategoryNav />
                        <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
                            {children}
                        </main>
                        <Footer />
                        <ComparisonFloatingBar />
                    </RecentlyViewedProvider>
                </CompareProvider>
            </CartProvider>
        </WishlistProvider>
    );
}
