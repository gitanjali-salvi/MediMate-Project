import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './HospitalDashboard.css';

const HospitalDashboard = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]); // State to hold real patient data

  // Fetch all patient users from the backend when the component loads
  useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return; // Don't fetch if there's no user

      try {
        const response = await axios.get('http://localhost:5000/api/users/role/patient', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        setPatients(response.data); // Store the real patient list in state
      } catch (err) { // This is the corrected block
        console.error("Failed to fetch patients:", err);
      }
    };

    fetchPatients();
  }, [user]); // Re-run if the user logs in/out

  const checkPatientConsents = async (patientId, patientName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/consents/hospital/patient/${patientId}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });

      if (response.data.length === 0) {
        alert(`No consents found for ${patientName}.`);
        return;
      }

      const consentInfo = response.data.map(c =>
        `- Insurer: ${c.insurerId ? c.insurerId.fullName : 'Unknown'}\n- Status: ${c.status}`
      ).join('\n\n');

      alert(`Consent Status for ${patientName}:\n\n${consentInfo}`);

    } catch (err) {
      console.error("Failed to fetch patient consents:", err);
      alert('Could not fetch consent information.');
    }
  };

  return (
    <div className="hospital-dashboard">
      <header className="dashboard-header">
        <div className="logo">MediMate Hospital Portal</div>
        <div className="hospital-info">{user ? user.fullName : 'Hospital Admin'}</div>
      </header>
      <div className="dashboard-content">
        <div className="patients-section">
          <div className="section-header"><h3>Patient Management</h3></div>
          <div className="patients-table">
            <div className="table-header">
              <div className="header-cell">Patient Name</div>
              <div className="header-cell">Patient Email</div>
              <div className="header-cell">Actions</div>
            </div>
            {patients.map((patient) => (
              <div key={patient._id} className="table-row">
                <div className="table-cell">{patient.fullName}</div>
                <div className="table-cell">{patient.email}</div>
                <div className="table-cell">
                  <button
                    onClick={() => checkPatientConsents(patient._id, patient.fullName)}
                    className="action-btn"
                  >
                    View Consents
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;