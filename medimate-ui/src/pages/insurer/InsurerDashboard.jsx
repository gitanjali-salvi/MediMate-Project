import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './InsurerDashboard.css';
import LogoutModal from '../../components/LogoutModal';

const InsurerDashboard = () => {
  const [claims, setClaims] = useState([]); // Changed from consents to claims
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'insurer') {
      const fetchClaims = async () => {
        try {
          // Fetch claims specifically for this insurer
          const response = await axios.get(`http://localhost:5000/api/claims/insurer/${user.id}`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          setClaims(response.data);
        } catch (err) {
          console.error("Failed to fetch claims:", err);
        }
      };
      fetchClaims();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#4caf50';
      case 'submitted': return '#2196f3';
      case 'reviewing': return '#ff9800';
      default: return '#f44336';
    }
  };

  const handleConfirmLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <LogoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmLogout} />
      <div className="insurer-dashboard">
        <header className="dashboard-header">
          <div className="logo">MediMate Insurer Portal</div>
          <div className="user-info">
            Welcome, {user ? user.fullName : 'Insurer'}
            <button onClick={() => setIsModalOpen(true)} className="logout-btn">Logout</button>
          </div>
        </header>
        <div className="dashboard-content">
          <div className="claims-section">
            <div className="section-header">
              <h3>New Policy & Claim Requests</h3>
            </div>
            <div className="claims-table">
              <div className="table-header">
                <div className="header-cell">Patient Name</div>
                <div className="header-cell">Claim ID</div>
                <div className="header-cell">Status</div>
                <div className="header-cell">Date</div>
                <div className="header-cell">Actions</div>
              </div>
              {claims.length > 0 ? claims.map((claim) => (
                <div key={claim._id} className="table-row">
                  <div className="table-cell">{claim.patientId ? claim.patientId.fullName : 'N/A'}</div>
                  <div className="table-cell">{claim.claimId}</div>
                  <div className="table-cell">
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(claim.status) }}>
                      {claim.status}
                    </span>
                  </div>
                  <div className="table-cell">{new Date(claim.submissionDate).toLocaleDateString()}</div>
                  <div className="table-cell">
                    <Link to={`/insurer/claim-review/${claim._id}`} className="review-btn">
                      Review
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="no-results">No pending requests found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InsurerDashboard;