import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import './ConsentManagement.css';

const ConsentManagement = () => {
  const [consents, setConsents] = useState([]);
  const { user } = useAuth(); // Get the full user object from context

  useEffect(() => {
    if (user) { // Only fetch if the user is logged in
      const fetchConsents = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/consents/${user.id}`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          setConsents(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchConsents();
    }
  }, [user]); // Re-run when the user object changes

  const handleToggleAccess = async (consentId, currentStatus) => {
    const newStatus = currentStatus === 'granted' ? 'revoked' : 'granted';
    try {
      const res = await axios.put(`http://localhost:5000/api/consents/${consentId}`, { status: newStatus }, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      setConsents(consents.map(consent => (consent._id === consentId ? res.data : consent)));
    } catch (err) {
      console.error(err);
    }
  };

  // ... (return statement remains the same, but the data is now dynamic)
  return (
    <div className="consent-management">
      {/* ... (header remains the same) ... */}
      <header className="consent-header">
        <Link to="/patient/dashboard" className="back-btn">← Back</Link>
        <h1>Manage Data Sharing</h1>
      </header>
      <div className="consent-content">
        <div className="consent-list">
          {consents.map((consent) => (
            <div key={consent._id} className="consent-item">
              {/* ... (rest of the component) ... */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsentManagement;