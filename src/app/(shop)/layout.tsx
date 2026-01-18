import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { CompareProvider } from '@/context/CompareContext';
import { WishlistProvider } from '@/context/WishlistContext';
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
                    <Navbar />
                    <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
                        {children}
                    </main>
                    <Footer />
                    <ComparisonFloatingBar />
                </CompareProvider>
            </CartProvider>
        </WishlistProvider>
    );
}
