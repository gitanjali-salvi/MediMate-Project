import React from 'react';

function Footer() {
    return (
        <footer className="landing-footer">
            <div className="footer-container">
                <div className="footer-column about">
                    <h3 className="footer-logo">MediMate 🩺</h3>
                    <p>
                        A project by students of A.P. Shah Institute of Technology, Thane. 
                        Securing healthcare data and automating insurance claims using Blockchain and AI.
                    </p>
                </div>
                <div className="footer-column links">
                    <h3 className="footer-heading">Quick Links</h3>
                    <ul>
                        <li><a href="#about-us">About Us</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#blogs">Blog</a></li>
                        <li><a href="/login">Login</a></li>
                    </ul>
                </div>
                <div className="footer-column contact">
                    <h3 className="footer-heading">Contact Us</h3>
                    <p>📍 A.P. Shah Institute of Technology, Thane, Maharashtra</p>
                    <p>✉️ <a href="mailto:info@medimate.com">info@medimate.com</a></p>
                </div>
                <div className="footer-column social">
                     <h3 className="footer-heading">Follow Us</h3>
                     <div className="social-icons">
                         {/* Replace # with actual links */}
                         <a href="#" aria-label="LinkedIn">{/* SVG Icon */}</a>
                         <a href="#" aria-label="Twitter">{/* SVG Icon */}</a>
                         <a href="#" aria-label="GitHub">{/* SVG Icon */}</a>
                     </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} MediMate. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;