import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    // Helper function for smooth scrolling
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="landing-nav">
            <div className="nav-logo">
                <Link to="/">MediMate 🩺</Link>
            </div>
            <div className="nav-links">
                <a onClick={() => scrollToSection('features')}>Features</a>
                <a onClick={() => scrollToSection('about-us')}>About Us</a>
                <a onClick={() => scrollToSection('testimonials')}>Testimonials</a>
                <a onClick={() => scrollToSection('blogs')}>Blog</a>
            </div>
            <div className="nav-actions">
                <Link to="/login">
                    <button className="btn-login">Login</button>
                </Link>
                {/* --- THIS IS THE CHANGE --- */}
                <Link to="/select-module">
                    <button className="btn-signup">Sign Up</button>
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;