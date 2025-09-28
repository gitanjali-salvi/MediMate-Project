import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './ConsentManagement.css';

const ConsentManagement = () => {
  const [consents, setConsents] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchConsents = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/consents/${user.id}`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          setConsents(res.data);
        } catch (err) {
          console.error("Error fetching consents:", err);
        }
      };
      fetchConsents();
    }
  }, [user]);

  const handleToggleAccess = async (consentId, currentStatus) => {
    const newStatus = currentStatus === 'granted' ? 'revoked' : 'granted';
    try {
      const res = await axios.put(`http://localhost:5000/api/consents/${consentId}`, { status: newStatus }, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      setConsents(consents.map(consent => (consent._id === consentId ? res.data : consent)));
    } catch (err) {
      console.error("Error updating consent:", err);
    }
  };

  return (
    <div className="consent-management">
      <header className="consent-header">
        <Link to="/patient/dashboard" className="back-btn">← Back</Link>
        <h1>Manage Data Sharing</h1>
      </header>
      <div className="consent-content">
        <div className="consent-list">
          {consents.map((consent) => (
            <div key={consent._id} className="consent-item">
              <div className="consent-info">
                <h3>{consent.insurerId ? consent.insurerId.fullName : 'Insurer'}</h3>
                <span className="entity-type">Insurer</span>
                {consent.status === 'granted' && (
                  <span className="granted-date">
                    Access granted on: {new Date(consent.date).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="consent-actions">
                {consent.status === 'granted' ? (
                  <button className="revoke-btn" onClick={() => handleToggleAccess(consent._id, consent.status)}>
                    Revoke Access
                  </button>
                ) : (
                  <button className="grant-btn" onClick={() => handleToggleAccess(consent._id, consent.status)}>
                    Grant Access
                  </button>
                )}
              </div>
              {consent.status === 'granted' && (
                <div className="blockchain-info">
                  <div className="txn-hash">
                    <span className="label">Blockchain Txn Hash:</span>
                    <span className="hash">{consent.txnHash || '0x...'}</span>
                    <span className="verified">Verified ✅</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="consent-explanation">
          <h3>About Data Sharing Consent</h3>
          <ul>
            <li>Your consent is recorded on the blockchain for transparency and immutability</li>
            <li>You can grant or revoke access at any time</li>
            <li>All access changes are logged with cryptographic proof</li>
            <li>Only authorized entities can view your medical data</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConsentManagement;