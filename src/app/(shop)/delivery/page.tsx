export const metadata = {
    title: 'Delivery Information | JElectronics',
    description: 'Delivery terms and conditions for JElectronics.',
};

export default function DeliveryPage() {
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Delivery Information</h1>
            <div style={{ maxWidth: '800px', lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ color: 'white', marginBottom: '1rem' }}>Nairobi County Delivery</h2>
                    <p>
                        We offer same-day delivery for all orders within Nairobi County placed before 4:00 PM.
                        Orders placed after 4:00 PM will be delivered the next business day.
                    </p>
                    <ul style={{ marginTop: '1rem', listStyle: 'disc', paddingLeft: '20px' }}>
                        <li><strong>Cost:</strong> KES 300</li>
                        <li><strong>Time:</strong> Within 3 hours</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ color: 'white', marginBottom: '1rem' }}>Outside Nairobi (Countrywide)</h2>
                    <p>
                        For customers outside Nairobi, we use trusted courier partners (G4S, Wells Fargo, etc.) to ensure your package arrives safely.
                    </p>
                    <ul style={{ marginTop: '1rem', listStyle: 'disc', paddingLeft: '20px' }}>
                        <li><strong>Cost:</strong> KES 400</li>
                        <li><strong>Time:</strong> Next Day Delivery (24-48 hours)</li>
                    </ul>
                </section>

                <section>
                    <h2 style={{ color: 'white', marginBottom: '1rem' }}>Store Pickup</h2>
                    <p>
                        You can also choose to pick up your order from our physical shop at <strong>Bihi Towers, Basement 1, Shop B10</strong> along Moi Avenue, Nairobi CBD.
                    </p>
                </section>
            </div>
        </div>
    );
}
