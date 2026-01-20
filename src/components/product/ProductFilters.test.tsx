
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductFilters from './ProductFilters';

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
    useSearchParams: () => ({
        get: vi.fn(),
        toString: () => '',
    }),
    usePathname: () => '/products',
}));

describe('ProductFilters', () => {
    it('renders filter sections', () => {
        // We strictly use standard queries that don't rely on jest-dom matchers for now
        render(<ProductFilters />);

        expect(screen.getByText('Price Range (KES)')).toBeTruthy();
        expect(screen.getByText('Color')).toBeTruthy();
        expect(screen.getByText('Storage')).toBeTruthy();
    });

    it('allows toggling color checkboxes', () => {
        render(<ProductFilters />);

        // Find the label that contains "Black" or the input associated with it
        const blackOption = screen.getByLabelText('Black') as HTMLInputElement;

        // Initially unchecked
        expect(blackOption.checked).toBe(false);

        // Click to toggle
        fireEvent.click(blackOption);

        // Should be checked
        expect(blackOption.checked).toBe(true);
    });
});
