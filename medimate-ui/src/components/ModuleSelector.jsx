import { Link } from 'react-router-dom';
import './ModuleSelector.css';

const ModuleSelector = () => {
  return (
    <div className="module-selector">
      <div className="selector-content">
        <h2>Select Your Role</h2>
        <p>Choose the appropriate module to begin your registration.</p>

        <div className="module-cards">
          {/* --- UPDATED LINKS --- */}
          <Link to="/signup/patient" className="module-card patient">
            <div className="module-icon">👤</div>
            <h3>Patient Portal</h3>
            <p>Upload documents, manage consent, and track your claims.</p>
          </Link>

          <Link to="/signup/insurer" className="module-card insurer">
            <div className="module-icon">🏢</div>
            <h3>Insurer Portal</h3>
            <p>Review and process AI-powered insurance claims.</p>
          </Link>

          <Link to="/signup/hospital" className="module-card hospital">
            <div className="module-icon">🏥</div>
            <h3>Hospital Portal</h3>
            <p>Upload patient records and verify medical documentation.</p>
          </Link>

          <Link to="/signup/admin" className="module-card admin">
            <div className="module-icon">⚙️</div>
            <h3>Admin Dashboard</h3>
            <p>Monitor system performance and manage operations.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModuleSelector;