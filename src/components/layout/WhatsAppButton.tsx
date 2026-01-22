import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton() {
    const phoneNumber = '254728882910';
    const message = 'Hello MobiTower, I am interested in your products.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
            title="Chat on WhatsApp"
        >
            <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="currentColor"
            >
                <path d="M12.031 6.172c-2.32 0-4.591 1.342-4.591 4.582 0 1.154.554 2.213 1.405 2.923l-.114 1.71 1.662-.892a4.479 4.479 0 0 0 1.638.311c2.32 0 4.591-1.342 4.591-4.582 0-3.24-2.271-4.582-4.591-4.582zm3.326 6.324c-.131.332-.676.591-1.025.632-.303.036-.693.048-1.121-.121a5.61 5.61 0 0 1-2.427-1.464 5.61 5.61 0 0 1-1.464-2.427c-.169-.428-.157-.818-.121-1.121.041-.349.3-.894.632-1.025.077-.03.155-.045.234-.045.166 0 .324.068.441.186l.66 1.585c.081.196.068.401-.035.586l-.328.583a.475.475 0 0 0 .041.528 3.327 3.327 0 0 0 1.096 1.096 4.148 4.148 0 0 0 .528.041l.583-.328c.185-.103.39-.116.586-.035l1.585.66c.118.117.186.275.186.441 0 .079-.015.157-.045.234zM12 2C6.477 2 2 6.477 2 12c0 1.891.526 3.662 1.438 5.169L2 22l4.831-1.438A9.954 9.954 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.967 7.967 0 0 1-4.135-1.153l-.296-.172-3.078.916.916-3.078-.172-.296A7.967 7.967 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
            </svg>
            <span className={styles.label}>Chat with us</span>
        </a>
    );
}
