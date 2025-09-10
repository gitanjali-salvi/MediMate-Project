import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ModuleSelector from './components/ModuleSelector'; // You created a great module selector

// Patient Module Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import UploadDocuments from './pages/patient/UploadDocuments';
import ConsentManagement from './pages/patient/ConsentManagement';
import ClaimTracking from './pages/patient/ClaimTracking';

// Hospital Module Pages
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import HospitalUpload from './pages/hospital/HospitalUpload';

// Insurer Module Pages
import InsurerDashboard from './pages/insurer/InsurerDashboard';
import ClaimReview from './pages/insurer/ClaimReview';

// Admin Module Page
import AdminDashboard from './pages/admin/AdminDashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* --- Module Selection (for demo purposes) --- */}
        <Route path="/select-module" element={<ModuleSelector />} />

        {/* --- Patient Routes --- */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/upload-documents" element={<UploadDocuments />} />
        <Route path="/patient/consent" element={<ConsentManagement />} />
        <Route path="/patient/track-claims" element={<ClaimTracking />} />
        
        {/* --- Hospital Routes --- */}
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/upload" element={<HospitalUpload />} />

        {/* --- Insurer Routes --- */}
        <Route path="/insurer/dashboard" element={<InsurerDashboard />} />
        <Route path="/insurer/claim-review/:claimId" element={<ClaimReview />} />
        
        {/* --- Admin Route --- */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;