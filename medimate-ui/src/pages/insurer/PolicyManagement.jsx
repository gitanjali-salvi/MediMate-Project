import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PolicyManagement = () => {
    const [policies, setPolicies] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ policyName: '', policyCode: '', description: '' });

    const fetchPolicies = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/policies/my-policies', {
            headers: { 'x-auth-token': token }
        });
        setPolicies(res.data);
    };

    useEffect(() => { fetchPolicies(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/policies', formData, {
                headers: { 'x-auth-token': token }
            });
            setShowForm(false);
            fetchPolicies();
        } catch (err) { alert(err.response.data.message); }
    };

    return (
        <div className="policy-mgmt">
            <div className="header-actions">
                <h3>My Policy Catalog</h3>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                    {showForm ? 'Cancel' : '+ Add New Policy Template'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="policy-form">
                    <input type="text" placeholder="Policy Name (e.g. Silver Health)" required 
                           onChange={e => setFormData({...formData, policyName: e.target.value})} />
                    <input type="text" placeholder="Policy Code (e.g. SH-01)" required 
                           onChange={e => setFormData({...formData, policyCode: e.target.value})} />
                    <textarea placeholder="Brief Description/Distinguishing Features" required 
                              onChange={e => setFormData({...formData, description: e.target.value})} />
                    <button type="submit">Publish to Catalog</button>
                </form>
            )}

            <div className="policy-grid">
                {policies.map(p => (
                    <div key={p._id} className="policy-card">
                        <h4>{p.policyName}</h4>
                        <span className="badge">{p.policyCode}</span>
                        <p>{p.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PolicyManagement;