import React from 'react';
import useOnScreen from '../hooks/useOnScreen';

const testimonialsData = [
    {
        quote: "MediMate is a game-changer. Uploading my mom's hospital bills was so simple, and the claim was processed faster than ever before. Finally, a system that puts patients first!",
        name: "Prakash Sharma",
        role: "Patient Family Member",
        image: "https://placehold.co/100x100/007bff/ffffff?text=PS"
    },
    {
        quote: "The pre-filled claim forms are incredibly accurate. This has cut down our manual data entry time by at least 60%, allowing us to focus more on genuine claim verification.",
        name: "Dr. Anjali Desai",
        role: "TPA Manager, Health Insurance Co.",
        image: "https://placehold.co/100x100/28a745/ffffff?text=AD"
    },
    {
        quote: "As a provider, getting patient consent and records on a secure ledger is revolutionary. It simplifies our administrative workflow and builds immense trust with our patients.",
        name: "Sanjay Gupta",
        role: "Administrator, City Hospital",
        image: "https://placehold.co/100x100/ffc107/ffffff?text=SG"
    }
];

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