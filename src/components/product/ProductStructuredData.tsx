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
        url?: string;
        priceValidUntil?: string;
        aggregateRating?: {
            ratingValue: number;
            reviewCount: number;
        };
    };
}

export default function ProductStructuredData({ product }: ProductStructuredDataProps) {
    const jsonLd: any = {
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
            url: product.url || `https://mobitoweraccesories.com/products/item/${product.sku}`,
            priceCurrency: product.currency,
            price: product.price,
            availability: product.availability === 'InStock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
            priceValidUntil: product.priceValidUntil || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        },
    };

    if (product.aggregateRating && product.aggregateRating.reviewCount > 0) {
        jsonLd.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: product.aggregateRating.ratingValue,
            reviewCount: product.aggregateRating.reviewCount,
        };
    }

    return (
        <Script
            id={`product-jsonld-${product.sku}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
