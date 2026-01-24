import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Returns & Exchanges | MobiTower Accessories',
    description: 'Our returns and exchange policy.',
};

export default function ReturnsPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 800 }}>Returns & Exchanges</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Return Policy</h2>
                <p style={{ lineHeight: '1.8', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                    At MobiTower Accessories, we want you to be completely satisfied with your purchase.
                    If you are not satisfied, you may return eligible items within <strong>7 days</strong> of delivery for an exchange.
                </p>
                <p style={{ lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
                    To be eligible for a return, your item must be unused, in the same condition that you received it, and must be in the original packaging.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Non-Returnable Items</h2>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                    <li>Gift cards</li>
                    <li>Downloadable software products</li>
                    <li>Some health and personal care items (e.g., in-ear headphones if opened, for hygiene reasons)</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Exchanges</h2>
                <p style={{ lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
                    We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at sales@mobitoweraccesories.com or call us at +254 728 882 910.
                </p>
            </section>

            <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Refunds</h2>
                <p style={{ lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
                    Once your return is received and inspected, we will notify you of the approval or rejection of your refund.
                    If approved, your refund will be processed via M-Pesa or the original method of payment within a certain amount of days.
                </p>
            </section>
        </div>
    );
}
