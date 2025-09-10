import React, { useState, useEffect } from 'react';
import useOnScreen from '../hooks/useOnScreen';

// (The staticBlogPosts and BlogCardSkeleton components remain the same)
const staticBlogPosts = [
    {
        image: "https://placehold.co/600x400/6c757d/ffffff?text=Blockchain+in+Healthcare",
        category: "Technology",
        title: "How Blockchain is Securing Patient Data",
        excerpt: "Discover the fundamentals of how a decentralized ledger can prevent fraud and ensure data integrity in the healthcare sector.",
        sourceUrl: "#"
    },
    {
        image: "https://placehold.co/600x400/17a2b8/ffffff?text=AI+in+Insurance",
        category: "Automation",
        title: "The Rise of AI in Insurance Claim Processing",
        excerpt: "Learn how artificial intelligence and OCR are transforming a traditionally paper-based industry, reducing errors and saving time.",
        sourceUrl: "#"
    },
    {
        image: "https://placehold.co/600x400/007bff/ffffff?text=Patient+Data+Ownership",
        category: "Patient Rights",
        title: "Why You Should Have Control Over Your Medical Records",
        excerpt: "We explore the importance of patient data ownership and how consent-based models are building a more equitable healthcare system.",
        sourceUrl: "#"
    }
];

const BlogCardSkeleton = () => (
    <div className="blog-card is-loading">
        <div className="blog-card-image-skeleton"></div>
        <div className="blog-card-content">
            <div className="skeleton skeleton-text skeleton-category"></div>
            <div className="skeleton skeleton-text skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text skeleton-small"></div>
        </div>
    </div>
);


function Blogs() {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            setIsLoading(true);
            
            const userQuery = `
                Find 3 recent, trending articles about the following topics:
                1. Innovations in blockchain for securing healthcare data.
                2. AI and automation in medical insurance claim processing.
                3. The importance of patient data ownership and new technologies.

                For each article, provide a title, a concise one-sentence excerpt, the source URL, and a relevant category.
            `;

            const responseSchema = {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        "category": { "type": "STRING" },
                        "title": { "type": "STRING" },
                        "excerpt": { "type": "STRING" },
                        "sourceUrl": { "type": "STRING" }
                    },
                    required: ["category", "title", "excerpt", "sourceUrl"]
                }
            };
            
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
            
            if (!apiKey) {
                console.error("Gemini API key not found. Please add it to your .env file.");
                setPosts(staticBlogPosts);
                setIsLoading(false);
                return;
            }

            // --- THIS IS THE CORRECTED API URL ---
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            // Simplified payload
            const payload = {
                contents: [{ parts: [{ text: userQuery }] }],
                tools: [{ "google_search": {} }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema
                }
            };

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorBody = await response.text();
                    console.error("API Response Error Body:", errorBody);
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                
                if (result.candidates && result.candidates[0].content.parts[0].text) {
                    const parsedPosts = JSON.parse(result.candidates[0].content.parts[0].text);
                    const postsWithImages = parsedPosts.map((post, index) => ({
                        ...post,
                        image: staticBlogPosts[index % staticBlogPosts.length].image
                    }));
                    setPosts(postsWithImages);
                } else {
                    throw new Error("No content found in API response.");
                }
            } catch (err) {
                console.error("Failed to fetch blog posts, falling back to static data:", err);
                setPosts(staticBlogPosts);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    return (
        <section id="blogs" className="blogs-section" ref={ref}>
            <div className="section-container">
                 <h2 className="section-title">From Our Blog</h2>
                 <p className="section-intro">Insights on technology, healthcare, and patient empowerment.</p>
                 <div className={`blogs-grid ${isVisible ? 'is-visible' : ''}`}>
                    {isLoading ? (
                        [...Array(3)].map((_, index) => <BlogCardSkeleton key={index} />)
                    ) : (
                        posts.map((post, index) => (
                            <div key={index} className="blog-card" style={{ transitionDelay: `${index * 150}ms` }}>
                                <img src={post.image} alt={post.title} className="blog-card-image" />
                                <div className="blog-card-content">
                                    <p className="blog-card-category">{post.category}</p>
                                    <h3 className="blog-card-title">{post.title}</h3>
                                    <p className="blog-card-excerpt">{post.excerpt}</p>
                                    <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="read-more-link">Read More &rarr;</a>
                                </div>
                            </div>
                        ))
                    )}
                 </div>
            </div>
        </section>
    );
}

export default Blogs;