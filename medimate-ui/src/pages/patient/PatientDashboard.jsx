import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PatientDashboard.css';
import LogoutModal from '../../components/LogoutModal';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // --- UPDATED TO READ FROM LOCALSTORAGE ---
    const patientName = localStorage.getItem('userName') || "Patient"; // Use the stored name, with a fallback
    const claimStatus = "In Processing";

    const handleConfirmLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName'); // Also remove the name on logout
        navigate('/');
    };

    return (
        <>
            <LogoutModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmLogout}
            />
            <div className="patient-dashboard">
                <header className="dashboard-header">
                    <div className="logo">MediMate</div>
                    <div className="welcome">
                        Welcome, {patientName} {/* This will now be the real name */}
                        <button onClick={() => setIsModalOpen(true)} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </header>

                {/* ... (The rest of your dashboard content is correct) ... */}
                <div className="dashboard-content">
                    <div className="claim-status-section">
                        <h3>Claim Status: {claimStatus}</h3>
                        <div className="timeline-view">
                            <div className="timeline-step completed">
                                <div className="step-circle"></div>
                                <span>Submitted</span>
                            </div>
                            <div className="timeline-step active">
                                <div className="step-circle"></div>
                                <span>In Processing</span>
                            </div>
                            <div className="timeline-step">
                                <div className="step-circle"></div>
                                <span>Approved</span>
                            </div>
                        </div>
                    </div>
                    <div className="action-buttons">
                        <Link to="/patient/upload-documents" className="action-btn">
                            Upload Documents
                        </Link>
                        <Link to="/patient/grant-consent" className="action-btn">
                            Grant New Consent
                        </Link>
                        <Link to="/patient/consent" className="action-btn">
                            Manage Consents
                        </Link>
                        <Link to="/patient/track-claims" className="action-btn">
                            Track Claims
                        </Link>
                        <Link to="/patient/profile" className="action-btn">
                            Profile Settings
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PatientDashboard;