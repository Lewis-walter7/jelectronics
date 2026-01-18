import styles from './about.module.css';

export const metadata = {
    title: 'About Us | JElectronics',
    description: 'Learn more about JElectronics, Kenya\'s premium tech store.',
};

export default function AboutPage() {
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>About JElectronics</h1>
            <div style={{ maxWidth: '800px', lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
                <p style={{ marginBottom: '1rem' }}>
                    Welcome to <strong>JElectronics</strong>, your number one source for all things tech. We're dedicated to providing you the very best of smartphones, laptops, and accessories, with an emphasis on premium quality, authentic products, and exceptional customer service.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                    Founded in 2024, JElectronics has come a long way from its beginnings in Nairobi. When we first started out, our passion for "Tech for the Modern Kenyan" drove us to start our own business.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                    We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
                </p>
                <p>
                    Sincerely,<br />
                    <strong>The JElectronics Team</strong>
                </p>
            </div>
        </div>
    );
}
