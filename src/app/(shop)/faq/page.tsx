'use client';

import { useState } from 'react';
import styles from './faq.module.css';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            category: 'Ordering & Payment',
            questions: [
                {
                    q: 'How do I place an order?',
                    a: 'Browse products, add to cart, and click checkout. Fill in your delivery details and choose your payment method.'
                },
                {
                    q: 'What payment methods do you accept?',
                    a: 'We accept M-Pesa, Bank Transfer, and Cash on Delivery (COD) for select locations.'
                },
                {
                    q: 'Is it safe to pay on your website?',
                    a: 'Yes! All transactions are secure. We use encrypted payment gateways for M-Pesa and bank transfers.'
                }
            ]
        },
        {
            category: 'Shipping & Delivery',
            questions: [
                {
                    q: 'Do you offer free delivery?',
                    a: 'Yes, we offer free delivery within Nairobi CBD. Charges may apply for other areas.'
                },
                {
                    q: 'How long does delivery take?',
                    a: 'Same-day dispatch for orders placed before 2 PM. Delivery typically within 1-2 business days in Nairobi, 2-5 days nationwide.'
                },
                {
                    q: 'Do you deliver outside Nairobi?',
                    a: 'Yes! We deliver countrywide. Delivery fees and times vary by location.'
                }
            ]
        },
        {
            category: 'Returns & Refunds',
            questions: [
                {
                    q: 'What is your return policy?',
                    a: 'We offer a 7-day return policy for unused, unopened products in original packaging.'
                },
                {
                    q: 'How do I return a product?',
                    a: 'Contact us via phone or email with your order number. We\'ll arrange pickup or provide return instructions.'
                },
                {
                    q: 'When will I get my refund?',
                    a: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item.'
                }
            ]
        },
        {
            category: 'Products & Warranty',
            questions: [
                {
                    q: 'Are your products genuine?',
                    a: 'Yes! All our products are 100% authentic and sourced from authorized distributors.'
                },
                {
                    q: 'Do you offer warranty?',
                    a: 'Yes, all products come with manufacturer\'s warranty.Duration varies by product(typically 6- 12 months).'
                },
                {
                    q: 'How do I claim warranty?',
                    a: 'Keep your receipt and warranty card. Contact us for warranty claims and we\'ll guide you through the process.'
                }
            ]
        }
    ];

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    let globalIndex = 0;

    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <h1 className={styles.pageTitle}>Frequently Asked Questions</h1>
            <p className={styles.subtitle}>Find answers to common questions about ordering, delivery, and our products.</p>

            <div className={styles.faqContainer}>
                {faqs.map((section, sectionIndex) => (
                    <div key={sectionIndex} className={styles.section}>
                        <h2 className={styles.categoryTitle}>{section.category}</h2>
                        <div className={styles.questions}>
                            {section.questions.map((faq, questionIndex) => {
                                const currentIndex = globalIndex++;
                                return (
                                    <div key={questionIndex} className={styles.faqItem}>
                                        <button
                                            className={`${styles.question} ${openIndex === currentIndex ? styles.active : ''}`}
                                            onClick={() => toggleQuestion(currentIndex)}
                                        >
                                            <span>{faq.q}</span>
                                            <span className={styles.icon}>{openIndex === currentIndex ? '−' : '+'}</span>
                                        </button>
                                        <div className={`${styles.answer} ${openIndex === currentIndex ? styles.open : ''}`}>
                                            <p>{faq.a}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.contactSection}>
                <h3>Still have questions?</h3>
                <p>Contact us at <a href="tel:+254788740000">+254 788 740 000</a> or <a href="mailto:sales@fonexpress.net">sales@fonexpress.net</a></p>
            </div>
        </div>
    );
}
