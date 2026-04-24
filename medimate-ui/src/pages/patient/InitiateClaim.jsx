import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InitiateClaim = () => {
    const [insurers, setInsurers] = useState([]);
    const [selectedInsurer, setSelectedInsurer] = useState('');
    const [policies, setPolicies] = useState([]);
    const navigate = useNavigate();

    // 1. Fetch all insurers
    useEffect(() => {
        const fetchInsurers = async () => {
            const res = await axios.get('http://localhost:5000/api/users/role/insurer');
            setInsurers(res.data);
        };
        fetchInsurers();
    }, []);

    // 2. Fetch policies for selected insurer
    useEffect(() => {
        if (selectedInsurer) {
            const fetchPolicies = async () => {
                const res = await axios.get(`http://localhost:5000/api/policies/insurer/${selectedInsurer}`);
                setPolicies(res.data);
            };
            fetchPolicies();
        }
    }, [selectedInsurer]);

    const handlePolicySelect = (policyId) => {
        // Navigate to the claim form with the selected policy info
        navigate(`/patient/file-claim?policyId=${policyId}`);
    };

    return (
        <div className="initiate-claim">
            <h2>Step 1: Identify Your Policy</h2>
            <div className="selection-group">
                <label>Select Your Insurance Company</label>
                <select onChange={(e) => setSelectedInsurer(e.target.value)}>
                    <option value="">-- Select Insurer --</option>
                    {insurers.map(i => <option key={i._id} value={i._id}>{i.fullName}</option>)}
                </select>
            </div>

            {selectedInsurer && (
                <div className="policy-list">
                    <h3>Available Plans for {insurers.find(i => i._id === selectedInsurer)?.fullName}</h3>
                    <div className="policy-selector-grid">
                        {policies.map(p => (
                            <div key={p._id} className="policy-option-card">
                                <h4>{p.policyName}</h4>
                                <p>Code: {p.policyCode}</p>
                                <button onClick={() => handlePolicySelect(p._id)}>This is my Policy &rarr;</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InitiateClaim;