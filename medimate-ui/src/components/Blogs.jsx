import React from 'react';
import useOnScreen from '../hooks/useOnScreen';

const blogPosts = [
    {
        image: "https://placehold.co/600x400/6c757d/ffffff?text=Blockchain+in+Healthcare",
        category: "Technology",
        title: "How Blockchain is Securing Patient Data",
        excerpt: "Discover the fundamentals of how a decentralized ledger can prevent fraud and ensure data integrity in the healthcare sector."
    },
    {
        image: "https://placehold.co/600x400/17a2b8/ffffff?text=AI+in+Insurance",
        category: "Automation",
        title: "The Rise of AI in Insurance Claim Processing",
        excerpt: "Learn how artificial intelligence and OCR are transforming a traditionally paper-based industry, reducing errors and saving time."
    },
    {
        image: "https://placehold.co/600x400/007bff/ffffff?text=Patient+Data+Ownership",
        category: "Patient Rights",
        title: "Why You Should Have Control Over Your Medical Records",
        excerpt: "We explore the importance of patient data ownership and how consent-based models are building a more equitable healthcare system."
    }
];

function Blogs() {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

    return (
        <section id="blogs" className="blogs-section" ref={ref}>
            <div className="section-container">
                 <h2 className="section-title">From Our Blog</h2>
                 <p className="section-intro">Insights on technology, healthcare, and patient empowerment.</p>
                 <div className={`blogs-grid ${isVisible ? 'is-visible' : ''}`}>
                    {blogPosts.map((post, index) => (
                        <div key={index} className="blog-card" style={{ transitionDelay: `${index * 150}ms` }}>
                            <img src={post.image} alt={post.title} className="blog-card-image" />
                            <div className="blog-card-content">
                                <p className="blog-card-category">{post.category}</p>
                                <h3 className="blog-card-title">{post.title}</h3>
                                <p className="blog-card-excerpt">{post.excerpt}</p>
                                <a href="#" className="read-more-link">Read More &rarr;</a>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </section>
    );
}

export default Blogs;