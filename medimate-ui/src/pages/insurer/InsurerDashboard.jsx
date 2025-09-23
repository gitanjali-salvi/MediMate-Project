import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './InsurerDashboard.css';

const InsurerDashboard = () => {
    const [consents, setConsents] = useState([]);
    const { user } = useAuth(); // Get the logged-in insurer

    useEffect(() => {
        // Only fetch data if there is a logged-in user with the role of 'insurer'
        if (user && user.role === 'insurer') {
            const fetchConsents = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/consents/insurer/${user.id}`, {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    });
                    setConsents(response.data);
                } catch (err) {
                    console.error("Failed to fetch consents for insurer:", err);
                }
            };
            fetchConsents();
        }
    }, [user]); // Re-run this effect if the user object changes

    const getStatusColor = (status) => {
        return status === 'granted' ? '#4caf50' : '#f44336';
    };

    return (
        <div className="insurer-dashboard">
            <header className="dashboard-header">
                <div className="logo">MediMate Insurer Portal</div>
                <div className="user-info">Welcome, {user ? user.fullName : 'Insurer'}</div>
            </header>

            <div className="dashboard-content">
                {/* You can update these stats dynamically later */}
                <div className="stats-overview">{/* ... */}</div>

                <div className="claims-section">
                    <div className="section-header">
                        <h3>Patient Consent Records</h3>
                    </div>

                    <div className="claims-table">
                        <div className="table-header">
                            <div className="header-cell">Patient Name</div>
                            <div className="header-cell">Document ID</div>
                            <div className="header-cell">Status</div>
                            <div className="header-cell">Last Updated</div>
                            <div className="header-cell">Actions</div>
                        </div>
                        
                        {consents.length > 0 ? consents.map((consent) => (
                            <div key={consent._id} className="table-row">
                                <div className="table-cell">{consent.patientId ? consent.patientId.fullName : 'N/A'}</div>
                                <div className="table-cell">{consent.documentId}</div>
                                <div className="table-cell">
                                    <span 
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(consent.status) }}
                                    >
                                        {consent.status}
                                    </span>
                                </div>
                                <div className="table-cell">{new Date(consent.date).toLocaleDateString()}</div>
                                <div className="table-cell">
                                    <Link 
                                        to={`/insurer/claim-review/${consent._id}`} // Example link
                                        className="review-btn"
                                        style={{ opacity: consent.status === 'granted' ? 1 : 0.5, pointerEvents: consent.status === 'granted' ? 'auto' : 'none' }}
                                    >
                                        Review
                                    </Link>
                                </div>
                            </div>
                        )) : (
                            <div className="no-results">No patient consents found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsurerDashboard;