import React, { useState, useEffect } from 'react';

const slides = [
    {
        headline: "Your Health Records, Secured.",
        subheadline: "MediMate uses Blockchain and AI to give you control over your medical data.",
        image: "https://placehold.co/1200x800/eaf2ff/007bff?text=Secure+Health+Vault"
    },
    {
        headline: "Insurance Claims, Automated.",
        subheadline: "Our AI engine auto-fills complex insurance forms in seconds, eliminating errors.",
        image: "https://placehold.co/1200x800/d4edda/28a745?text=AI+Automation"
    },
    {
        headline: "Complete Patient Control.",
        subheadline: "You own your data. Grant or revoke access to doctors and insurers with a single click.",
        image: "https://placehold.co/1200x800/fff3cd/ffc107?text=Patient+Consent"
    }
];

function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="hero-slider">
            {slides.map((slide, index) => (
                <div 
                    key={index}
                    className={`slide ${index === currentSlide ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${slide.image})` }}
                >
                    <div className="slide-content">
                        <h1 className="hero-headline">{slide.headline}</h1>
                        <p className="hero-subheadline">{slide.subheadline}</p>
                        <div className="hero-cta">
                             <button className="btn-primary-solid">Get Started for Free</button>
                             <button className="btn-secondary-outline">Watch Demo</button>
                        </div>
                    </div>
                </div>
            ))}
            <div className="slider-dots">
                {slides.map((_, index) => (
                    <button 
                        key={index} 
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>
        </section>
    );
}

export default HeroSlider;