import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './UploadDocuments.css'; // Reusing styles from another page

const GrantConsent = () => {
    const [insurers, setInsurers] = useState([]);
    const [selectedInsurer, setSelectedInsurer] = useState('');
    const [documentId, setDocumentId] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch the list of all insurers to populate the dropdown
    useEffect(() => {
        const fetchInsurers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/role/insurer', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                setInsurers(response.data);
            } catch (err) {
                console.error("Failed to fetch insurers:", err);
            }
        };

        if (user) {
            fetchInsurers();
        }
    }, [user]);

    // Handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedInsurer || !documentId) {
            setError('Please select an insurer and provide a document ID.');
            return;
        }
        setError('');

        try {
            // Call the POST API to create the new consent in the database
            await axios.post('http://localhost:5000/api/consents', {
                patientId: user.id,
                insurerId: selectedInsurer,
                documentId: documentId
            }, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            alert('Consent granted successfully!');
            navigate('/patient/consent'); // Go to the management page to see the new consent
        } catch (err) {
            console.error("Failed to grant consent:", err);
            setError('Could not grant consent. Please try again.');
        }
    };

    return (
        <div className="upload-documents">
            <header className="upload-header">
                <Link to="/patient/dashboard" className="back-btn">← Back</Link>
                <h1>Grant Consent to Insurer</h1>
            </header>
            <div className="upload-content">
                <form onSubmit={handleSubmit} className="document-list">
                    <div className="document-item">
                        <label className="document-label">Select Insurer</label>
                        <select
                            value={selectedInsurer}
                            onChange={(e) => setSelectedInsurer(e.target.value)}
                            className="patient-select" // Reusing style
                        >
                            <option value="">-- Choose an Insurer --</option>
                            {insurers.map(insurer => (
                                <option key={insurer._id} value={insurer._id}>
                                    {insurer.fullName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="document-item">
                        <label className="document-label">Document / Claim ID</label>
                        <input
                            type="text"
                            value={documentId}
                            onChange={(e) => setDocumentId(e.target.value)}
                            placeholder="e.g., Hospital_Bill_July2025"
                            className="patient-select" // Reusing style
                        />
                    </div>
                    {error && <p className="error-text" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    <button type="submit" className="submit-btn" style={{ marginTop: '1rem' }}>
                        Grant Consent
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GrantConsent;