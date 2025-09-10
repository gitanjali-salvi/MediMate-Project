import React from 'react';
import useOnScreen from '../hooks/useOnScreen';

function AboutUs() {
    const [ref, isVisible] = useOnScreen({ threshold: 0.3 });

    return (
        <section id="about-us" className="about-section" ref={ref}>
            <div className={`about-container ${isVisible ? 'is-visible' : ''}`}>
                <div className="about-image">
                    {/* Placeholder for an image or illustration */}
                    <img src="https://placehold.co/600x400/17a2b8/ffffff?text=Our+Mission" alt="MediMate Mission" />
                </div>
                <div className="about-content">
                    <h2 className="section-title">Bridging the Gap Between Healthcare and Insurance</h2>
                    <p className="section-intro">
                        MediMate was born from a simple idea: healthcare administration should be secure, transparent, and patient-centric. We are a team of engineers from A.P. Shah Institute of Technology, dedicated to solving real-world problems through cutting-edge technology.
                    </p>
                    <p>
                        Our platform leverages the immutability of blockchain and the intelligence of AI to empower patients, streamline processes for providers, and reduce fraud for insurers. We believe in a future where managing your health data is as simple and secure as managing your finances.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default AboutUs;