import { Link } from 'react-router-dom';
import './ModuleSelector.css';

// SVG Icon Components for a more professional look
const PatientIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>;
const InsurerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const HospitalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l.7.7-1.4 1.4L12 2zM12 22l.7-.7-1.4-1.4L12 22zM2 12l.7.7-1.4-1.4L2 12zm20 0l-.7.7 1.4-1.4L22 12z"></path><path d="M8 8v8h8V8H8zm2 2h4v4h-4v-4z"></path></svg>;
const AdminIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path><path d="M4 17V5a2 2 0 0 1 2-2h11"></path></svg>;


const ModuleSelector = () => {
  return (
    <div className="module-selector">
      <div className="selector-content">
        <h2>Select Your Role</h2>
        <p>Choose the appropriate module to begin your registration</p>

        <div className="module-cards">
          <Link to="/signup/patient" className="module-card patient">
            <div className="module-icon"><PatientIcon /></div>
            <h3>Patient Portal</h3>
            <p>Upload documents, manage consent, and track your claims.</p>
          </Link>

          <Link to="/signup/insurer" className="module-card insurer">
            <div className="module-icon"><InsurerIcon /></div>
            <h3>Insurer Portal</h3>
            <p>Review and process AI-powered insurance claims.</p>
          </Link>

          <Link to="/signup/hospital" className="module-card hospital">
            <div className="module-icon"><HospitalIcon /></div>
            <h3>Hospital Portal</h3>
            <p>Upload patient records and verify medical documentation.</p>
          </Link>

          <Link to="/signup/admin" className="module-card admin">
            <div className="module-icon"><AdminIcon /></div>
            <h3>Admin Dashboard</h3>
            <p>Monitor system performance and manage operations.</p>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ModuleSelector;