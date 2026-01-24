import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | MobiTower Accessories',
    description: 'Terms and conditions for using our service.',
};

export default function TermsPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 800 }}>Terms of Service</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Overview</h2>
                <p style={{ lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
                    This website is operated by MobiTower Accessories. Throughout the site, the terms “we”, “us” and “our” refer to MobiTower Accessories.
                    MobiTower Accessories offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Online Store Terms</h2>
                <p style={{ lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
                    By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence.
                </p>
                <p style={{ lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
                    You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Products and Services</h2>
                <p style={{ lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
                    Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
                </p>
                <p style={{ lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
                    We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
                </p>
            </section>

            <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Contact Information</h2>
                <p style={{ lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
                    Questions about the Terms of Service should be sent to us at sales@mobitoweraccesories.com.
                </p>
            </section>
        </div>
    );
}
