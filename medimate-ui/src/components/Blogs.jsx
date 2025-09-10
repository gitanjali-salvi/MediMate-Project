import React, { useState, useEffect } from 'react';
import useOnScreen from '../hooks/useOnScreen';

// (The staticBlogPosts and BlogCardSkeleton components are unchanged)
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
        const fetchAndCacheBlogPosts = async () => {
            setIsLoading(true);
            const cacheKey = 'blogPostsCache';
            const cacheTimestampKey = 'blogPostsCacheTimestamp';
            const cacheDuration = 60 * 60 * 1000; // 1 hour in milliseconds

            const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
            const cachedPosts = localStorage.getItem(cacheKey);

            if (cachedPosts && cachedTimestamp && (Date.now() - cachedTimestamp < cacheDuration)) {
                // If we have fresh data in the cache, use it
                setPosts(JSON.parse(cachedPosts));
                setIsLoading(false);
                console.log("Loaded blog posts from cache.");
                return;
            }

            console.log("Cache is old or empty. Fetching new blog posts...");
            
            const prompt = `
                Find 3 recent, trending articles on:
                1. Blockchain in healthcare security.
                2. AI in medical insurance automation.
                3. Patient data ownership.

                IMPORTANT: Respond ONLY with a valid JSON array of objects in a \`\`\`json markdown block.
                Each object must have these exact properties: "category", "title", "excerpt", "sourceUrl".
            `;
            
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
            
            if (!apiKey) {
                console.error("API key not found.");
                setPosts(staticBlogPosts);
                setIsLoading(false);
                return;
            }

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

            const payload = {
                contents: [{ parts: [{ text: prompt }] }],
                tools: [{ "google_search": {} }],
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
                    throw new Error(`API error: ${response.status}`);
                }

                const result = await response.json();
                
                if (result.candidates && result.candidates[0].content.parts[0].text) {
                    let textResponse = result.candidates[0].content.parts[0].text;
                    const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/);
                    
                    if (jsonMatch && jsonMatch[1]) {
                        const jsonString = jsonMatch[1];
                        const parsedPosts = JSON.parse(jsonString);
                        const postsWithImages = parsedPosts.map((post, index) => ({
                            ...post,
                            image: staticBlogPosts[index % staticBlogPosts.length].image
                        }));
                        setPosts(postsWithImages);
                        // Save the new data and timestamp to the cache
                        localStorage.setItem(cacheKey, JSON.stringify(postsWithImages));
                        localStorage.setItem(cacheTimestampKey, Date.now());
                    } else {
                        throw new Error("Could not parse JSON from the API response.");
                    }
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

        fetchAndCacheBlogPosts();
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