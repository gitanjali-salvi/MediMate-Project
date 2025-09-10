import React from 'react';
import useOnScreen from '../hooks/useOnScreen';
// Step 2: Import the new image from your assets folder
import missionImage from '../assets/OurMission.png'; 

function AboutUs() {
    const [ref, isVisible] = useOnScreen({ threshold: 0.3 });

    return (
        <section id="about-us" className="about-section" ref={ref}>
            <div className={`about-container ${isVisible ? 'is-visible' : ''}`}>
                <div className="about-image">
                    {/* Step 3: Use the imported image in the 'src' attribute */}
                    <img src={missionImage} alt="MediMate Mission" />
                </div>
                <div className="about-content">
                    <h2 className="section-title">Bridging the Gap Between Healthcare and Insurance</h2>
                    <p className="section-intro">
                        MediMate was born from a simple idea: healthcare administration should be secure, transparent, and patient-centric. We are a team of engineers from A.P. Shah Institute of Technology, dedicated to solving real-world problems through cutting-edge technology.
                    </p>
                    <p>
                        Our platform uses blockchain to secure your data and artificial intelligence to simplify your life. We empower patients by giving them control, while our AI automates the most tedious part of healthcare: filling out insurance claim forms. This streamlines the process for providers, reduces fraud for insurers, and gets claims settled faster.

                    </p>
                </div>
            </div>
        </section>
    );
}

export default AboutUs;