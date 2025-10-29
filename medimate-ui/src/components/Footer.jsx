import React from 'react';

// Social Media SVG Icons
const LinkedInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
const TwitterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.424.727-.666 1.581-.666 2.477 0 1.944 1.134 3.633 2.784 4.542-.83-.026-1.597-.257-2.246-.621v.059c0 2.688 1.808 4.989 4.223 5.49-.494.134-.99.202-1.503.202-.343 0-.662-.033-.974-.093.726 2.166 2.833 3.737 5.334 3.78-1.84 1.447-4.148 2.308-6.663 2.308-.432 0-.85-.025-1.264-.075 2.36 1.534 5.168 2.437 8.134 2.437 9.705 0 14.994-8.034 14.994-14.994 0-.227-.005-.453-.014-.678.96-.692 1.794-1.558 2.457-2.541z"/></svg>;
const GitHubIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;


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
                         <a href="https://www.linkedin.com/in/gitanjali-salvi-1a2216259" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><LinkedInIcon /></a>
                         <a href="https://x.com/GitanjaliSalvi" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><TwitterIcon /></a>
                         <a href="https://github.com/gitanjali-salvi" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><GitHubIcon /></a>
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