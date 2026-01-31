'use client';

import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

interface Breadcrumb {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    crumbs: Breadcrumb[];
}

export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
    // Generate BreadcrumbList Schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://mobitoweraccesories.com'
            },
            ...crumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 2,
                name: crumb.label,
                item: `https://mobitoweraccesories.com${crumb.href}`
            }))
        ]
    };

    return (
        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ul className={styles.list}>
                <li className={styles.item}>
                    <Link href="/" className={styles.link}>
                        Home
                    </Link>
                </li>
                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;
                    return (
                        <li key={index} className={styles.item}>
                            <span className={styles.separator}>›</span>
                            {isLast ? (
                                <span className={styles.current}>{crumb.label}</span>
                            ) : (
                                <Link href={crumb.href} className={styles.link}>
                                    {crumb.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
