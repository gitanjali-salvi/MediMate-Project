import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for the request
import './PatientDashboard.css';
import LogoutModal from '../../components/LogoutModal';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const patientName = localStorage.getItem('userName') || "Patient";
    const patientId = localStorage.getItem('userId'); // Ensure you store userId during login
    const claimStatus = "In Processing";

    // --- NEW: HANDLE APPLY POLICY ---
    const handleApplyPolicy = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            // For the demo, we use a static Insurer ID and placeholder Document IDs
            // Replace 'STATIC_INSURER_ID' with an actual User ID from your MongoDB 'users' collection
            const policyData = {
                patientId: patientId,
                insurerId: "65ac3f3db619619f84463c21", // Static demo ID
                documentIds: ["65ac3f3db619619f84463c22"], // Replace with actual uploaded Doc IDs
                consentId: "65ac3f3db619619f84463c23",   // Placeholder Consent ID
                claimAmount: 50000,
                diagnosis: "Routine Checkup / Policy Initiation"
            };

            const response = await axios.post('http://localhost:5000/api/claims', policyData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 201) {
                alert("Policy Application Submitted Successfully!");
                navigate('/patient/track-claims');
            }
        } catch (err) {
            console.error("Policy application failed:", err);
            alert("Error submitting policy application.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
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
                        Welcome, {patientName}
                        <button onClick={() => setIsModalOpen(true)} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </header>

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
                        {/* --- NEW BUTTON FOR POLICY APPLICATION --- */}
                        <button 
                            onClick={handleApplyPolicy} 
                            className="action-btn policy-btn" 
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Apply for New Policy"}
                        </button>

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