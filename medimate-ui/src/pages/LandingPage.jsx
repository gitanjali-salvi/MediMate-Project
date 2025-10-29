import React from 'react';
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider'; // Use the new HeroSlider
import Features from '../components/Features';
import AboutUs from '../components/AboutUs'; // Import new component
import Testimonials from '../components/Testimonials'; // Import new component
import Blogs from '../components/Blogs'; // Import new component
import Footer from '../components/Footer';
import '../LandingPage.css';

function LandingPage() {
    return (
        <div className="landing-page">
            <Navbar />
            <main>
                <HeroSlider />
                <Features />
                <AboutUs />
                <Testimonials />
                <Blogs />
            </main>
            <Footer />
        </div>
    );
}

export default LandingPage;