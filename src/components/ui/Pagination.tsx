'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';


interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', gap: '0.5rem' }}>
            {/* Prev Button */}
            <Link
                href={currentPage > 1 ? createPageURL(currentPage - 1) : '#'}
                aria-disabled={currentPage <= 1}
                style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    background: currentPage <= 1 ? 'transparent' : 'var(--color-surface)',
                    border: '1px solid var(--color-surface-hover)',
                    color: currentPage <= 1 ? 'var(--color-text-muted)' : 'var(--color-text-main)',
                    textDecoration: 'none',
                    pointerEvents: currentPage <= 1 ? 'none' : 'auto',
                    opacity: currentPage <= 1 ? 0.5 : 1
                }}
            >
                Previous
            </Link>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                    key={page}
                    href={createPageURL(page)}
                    style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        background: currentPage === page ? 'var(--color-primary)' : 'var(--color-surface)',
                        border: currentPage === page ? 'none' : '1px solid var(--color-surface-hover)',
                        color: currentPage === page ? 'white' : 'var(--color-text-main)',
                        textDecoration: 'none',
                        fontWeight: currentPage === page ? 600 : 400
                    }}
                >
                    {page}
                </Link>
            ))}

            {/* Next Button */}
            <Link
                href={currentPage < totalPages ? createPageURL(currentPage + 1) : '#'}
                aria-disabled={currentPage >= totalPages}
                style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    background: currentPage >= totalPages ? 'transparent' : 'var(--color-surface)',
                    border: '1px solid var(--color-surface-hover)',
                    color: currentPage >= totalPages ? 'var(--color-text-muted)' : 'var(--color-text-main)',
                    textDecoration: 'none',
                    pointerEvents: currentPage >= totalPages ? 'none' : 'auto',
                    opacity: currentPage >= totalPages ? 0.5 : 1
                }}
            >
                Next
            </Link>
        </div>
    );
}
