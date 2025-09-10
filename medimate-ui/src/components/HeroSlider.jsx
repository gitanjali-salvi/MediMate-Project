import React, { useState, useEffect } from 'react';
// Import the Link component to make the button a navigator
import { Link } from 'react-router-dom';

// Import your local image file
import securityImage from '../assets/blockchain-security.png'; 

const slides = [
    {
        headline: "Your Health Records, Secured.",
        subheadline: "MediMate uses Blockchain and AI to give you control over your medical data.",
        image: securityImage
    },
    {
        headline: "Insurance Claims, Automated.",
        subheadline: "Our AI engine auto-fills complex insurance forms in seconds, eliminating errors.",
        image: "https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        headline: "Complete Patient Control.",
        subheadline: "You own your data. Grant or revoke access to doctors and insurers with a single click.",
        image: "https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
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
                >
                    <div 
                        className="slide-background"
                        style={{ backgroundImage: `url(${slide.image})` }}
                    ></div>
                    <div className="slide-content">
                        <h1 className="hero-headline">{slide.headline}</h1>
                        <p className="hero-subheadline">{slide.subheadline}</p>
                        <div className="hero-cta">
                             {/* --- THIS IS THE CHANGE --- */}
                             {/* The button is now wrapped in a Link and the demo button is removed */}
                             <Link to="/select-module">
                                <button className="btn-primary-solid">Get Started for Free</button>
                             </Link>
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