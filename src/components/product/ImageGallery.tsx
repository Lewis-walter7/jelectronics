'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ImageGallery.module.css';

interface ImageGalleryProps {
    images: string[];
    name: string;
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
    const allImages = images && images.length > 0
        ? images.filter(img => img && img.trim() !== '')
        : ['/images/placeholder.jpg'];

    // Use index instead of URL to avoid state sync issues
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Safeguard in case images change
    const safeIndex = selectedIndex >= allImages.length ? 0 : selectedIndex;
    const selectedImage = allImages[safeIndex];

    return (
        <div className={styles.container}>
            <div className={styles.mainImageWrapper}>
                <Image
                    src={selectedImage}
                    alt={name}
                    fill
                    className={styles.mainImage}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {allImages.length > 1 && (
                <div className={styles.thumbnails}>
                    {allImages.map((img, index) => (
                        <button
                            key={img + index}
                            onClick={() => setSelectedIndex(index)}
                            className={`${styles.thumbnail} ${safeIndex === index ? styles.active : ''}`}
                        >
                            <Image
                                src={img}
                                alt={`${name} ${index + 1}`}
                                fill
                                className={styles.thumbImg}
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
