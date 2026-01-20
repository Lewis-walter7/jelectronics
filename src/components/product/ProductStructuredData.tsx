import Script from 'next/script';

interface ProductStructuredDataProps {
    product: {
        name: string;
        description: string;
        imageUrl: string;
        price: number;
        currency: string;
        sku: string;
        brand?: string;
        availability: 'InStock' | 'OutOfStock';
    };
}

export default function ProductStructuredData({ product }: ProductStructuredDataProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.imageUrl,
        description: product.description,
        sku: product.sku,
        brand: {
            '@type': 'Brand',
            name: product.brand || 'MobiTower Accessories',
        },
        offers: {
            '@type': 'Offer',
            url: `https://mobitoweraccesories.com/products/item/${product.sku}`, // Adjust URL structure
            priceCurrency: product.currency,
            price: product.price,
            availability: product.availability === 'InStock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
        },
    };

    return (
        <Script
            id={`product-jsonld-${product.sku}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
