
import { describe, it, expect } from 'vitest';
import { SignInSchema, MpesaPaymentSchema } from './validators';

describe('SignInSchema', () => {
    it('validates correct credentials', () => {
        const valid = { email: 'admin@example.com', password: 'password123' };
        const result = SignInSchema.safeParse(valid);
        expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
        const invalid = { email: 'not-an-email', password: 'password123' };
        const result = SignInSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });

    it('rejects short passwords', () => {
        const invalid = { email: 'admin@example.com', password: '123' };
        const result = SignInSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });
});

describe('MpesaPaymentSchema', () => {
    it('validates correct payment details', () => {
        const valid = {
            customer: {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '0712345678',
                address: '123 Street'
            },
            items: [
                { id: '1', name: 'Product', price: 100, quantity: 1 }
            ],
            totalAmount: 100
        };
        const result = MpesaPaymentSchema.safeParse(valid);
        expect(result.success).toBe(true);
    });

    it('validates +254 phone format', () => {
        const valid = {
            customer: {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+254712345678',
                address: '123 Street'
            },
            items: [{ id: '1', name: 'Product', price: 100, quantity: 1 }],
            totalAmount: 100
        };
        const result = MpesaPaymentSchema.safeParse(valid);
        expect(result.success).toBe(true);
    });

    it('rejects invalid phone number', () => {
        const invalid = {
            customer: {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '12345', // Too short
                address: '123 Street'
            },
            items: [{ id: '1', name: 'Product', price: 100, quantity: 1 }],
            totalAmount: 100
        };
        const result = MpesaPaymentSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });

    it('rejects empty cart', () => {
        const invalid = {
            customer: {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '0712345678',
                address: '123 Street'
            },
            items: [], // Empty
            totalAmount: 100
        };
        const result = MpesaPaymentSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });
});
