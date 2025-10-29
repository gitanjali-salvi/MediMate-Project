import React from 'react';
import useOnScreen from '../hooks/useOnScreen';

const testimonialsData = [
    {
        quote: "MediMate is a game-changer. Uploading my mom's hospital bills was so simple, and the claim was processed faster than ever before. Finally, a system that puts patients first!",
        name: "Prakash Sharma",
        role: "Patient Family Member",
        // NEW IMAGE
        image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        quote: "The pre-filled claim forms are incredibly accurate. This has cut down our manual data entry time by at least 60%, allowing us to focus more on genuine claim verification.",
        name: "Dr. Anjali Desai",
        role: "TPA Manager, Health Insurance Co.",
        // NEW IMAGE
        image: "https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        quote: "As a provider, getting patient consent and records on a secure ledger is revolutionary. It simplifies our administrative workflow and builds immense trust with our patients.",
        name: "Sanjana Gupta",
        role: "Administrator, City Hospital",
        // NEW IMAGE
        image: "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
];

// SVG for the quote icon
const QuoteIcon = () => (
    <svg className="testimonial-quote-icon" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.983 3v7.391c0 2.908-2.355 5.263-5.263 5.263s-5.263-2.355-5.263-5.263V3h10.526zM24 3v7.391c0 2.908-2.355 5.263-5.263 5.263s-5.263-2.355-5.263-5.263V3h10.526z"/>
    </svg>
);


function Testimonials() {
     const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

    return (
        <section id="testimonials" className="testimonials-section" ref={ref}>
            <div className="section-container">
                <h2 className="section-title">Trusted by Patients and Providers</h2>
                <p className="section-intro">Hear what people are saying about the MediMate platform.</p>
                <div className={`testimonials-grid ${isVisible ? 'is-visible' : ''}`}>
                    {testimonialsData.map((testimonial, index) => (
                         <div key={index} className="testimonial-card" style={{ transitionDelay: `${index * 150}ms` }}>
                             <QuoteIcon />
                             <img src={testimonial.image} alt={testimonial.name} className="testimonial-image" />
                             <p className="testimonial-quote">"{testimonial.quote}"</p>
                             <div className="testimonial-author">
                                 <p className="author-name">{testimonial.name}</p>
                                 <p className="author-role">{testimonial.role}</p>
                             </div>
                         </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;