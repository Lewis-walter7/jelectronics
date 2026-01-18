'use client';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css'; // Reusing styles or create new

export default function AddToCartButton({ product }: { product: any }) {
    const { addToCart } = useCart();

    const handleAdd = () => {
        addToCart({
            id: product.id || product._id,
            name: product.name || product.title,
            price: product.price,
            imageUrl: product.imageUrl || product.image || '',
        });
        alert('Added to cart!');
    };

    return (
        <button
            onClick={handleAdd}
            className={styles.addButton}
            style={{ marginTop: '1rem', padding: '15px 30px', fontSize: '1.1rem' }}
        >
            Add to Cart
        </button>
    );
}
