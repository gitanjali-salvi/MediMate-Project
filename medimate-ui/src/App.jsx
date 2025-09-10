import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ModuleSelector from './components/ModuleSelector';

// ... (imports for all dashboard pages remain the same) ...
import PatientDashboard from './pages/patient/PatientDashboard';
import UploadDocuments from './pages/patient/UploadDocuments';
import ConsentManagement from './pages/patient/ConsentManagement';
import ClaimTracking from './pages/patient/ClaimTracking';
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import HospitalUpload from './pages/hospital/HospitalUpload';
import InsurerDashboard from './pages/insurer/InsurerDashboard';
import ClaimReview from './pages/insurer/ClaimReview';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* --- UPDATED SIGNUP ROUTE --- */}
        <Route path="/signup/:role" element={<SignupPage />} /> 

        {/* Module Selection */}
        <Route path="/select-module" element={<ModuleSelector />} />

        {/* Protected Routes */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/upload-documents" element={<UploadDocuments />} />
        <Route path="/patient/consent" element={<ConsentManagement />} />
        <Route path="/patient/track-claims" element={<ClaimTracking />} />
        
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/upload" element={<HospitalUpload />} />

        <Route path="/insurer/dashboard" element={<InsurerDashboard />} />
        <Route path="/insurer/claim-review/:claimId" element={<ClaimReview />} />
        
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;