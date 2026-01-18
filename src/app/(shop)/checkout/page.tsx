'use client';
import { useState } from 'react';
import styles from './checkout.module.css';
import CartStep from '@/components/checkout/CartStep';
import ShippingStep from '@/components/checkout/ShippingStep';
import ConfirmationStep from '@/components/checkout/ConfirmationStep';

export default function CheckoutPage() {
    const [currentStep, setCurrentStep] = useState(1);

    const steps = [
        { id: 1, label: 'Shopping Cart' },
        { id: 2, label: 'Shipping & Checkout' },
        { id: 3, label: 'Confirmation' },
    ];

    return (
        <div className={`container ${styles.container}`}>
            {/* Step Indicator */}
            <div className={styles.stepsContainer}>
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`${styles.stepWrapper} ${currentStep === step.id ? styles.active : ''} ${currentStep > step.id ? styles.completed : ''}`}
                    >
                        <div className={styles.stepCircle}>
                            {currentStep > step.id ? '✓' : step.id}
                        </div>
                        <span className={styles.stepLabel}>{step.label}</span>
                    </div>
                ))}
            </div>

            {/* Step Content */}
            {currentStep === 1 && <CartStep onNext={() => setCurrentStep(2)} />}
            {currentStep === 2 && <ShippingStep onBack={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} />}
            {currentStep === 3 && <ConfirmationStep />}
        </div>
    );
}
