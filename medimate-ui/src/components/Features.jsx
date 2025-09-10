import React from 'react';
import useOnScreen from '../hooks/useOnScreen'; // We'll keep using this for the animation

// SVG Icon Components
const IconBlockchain = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="8" width="8" height="8" rx="2"></rect>
        <path d="M8 12h-4a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2h4"></path>
        <path d="M16 12h4a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-4"></path>
        <path d="M12 8v-4a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v4"></path>
        <path d="M12 16v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2 -2v-4"></path>
    </svg>
);

const IconAI = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4l3 3"></path>
        <path d="M12 21a9 9 0 1 0 -9 -9"></path>
        <path d="M22 12c-6 0 -9 3 -9 9"></path>
    </svg>
);

const IconControl = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0 -4 -4H5a4 4 0 0 0 -4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0 -3 -3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);


const featuresData = [
    {
        icon: <IconBlockchain />,
        title: 'Blockchain Security',
        description: 'Your health records are stored in a tamper-proof, decentralized vault, ensuring data integrity and privacy.',
    },
    {
        icon: <IconAI />,
        title: 'AI-Powered Automation',
        description: 'Our AI engine reads your medical documents and auto-fills complex insurance claim forms in seconds, eliminating errors.',
    },
    {
        icon: <IconControl />,
        title: 'Complete Patient Control',
        description: 'You own your data. Grant or revoke access to doctors and insurers with a single click using our consent manager.',
    },
];

// A small component for individual cards to apply the hook
function FeatureCard({ feature, index }) {
    const [ref, isVisible] = useOnScreen({
        threshold: 0.2, // Trigger when 20% of the card is visible
    });

    return (
        <div 
            ref={ref} 
            className={`feature-card ${isVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: `${index * 100}ms` }} // Stagger the animation
        >
            <div className="feature-icon">{feature.icon}</div>
            <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
            </div>
        </div>
    );
}


function Features() {
    return (
        <section id="features" className="features-section">
            <div className="section-container">
                <h2 className="section-title">A Smarter Way to Manage Healthcare</h2>
                <p className="section-intro">MediMate is designed to solve the biggest problems in health data management and insurance processing.</p>
                <div className="features-grid">
                    {featuresData.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;