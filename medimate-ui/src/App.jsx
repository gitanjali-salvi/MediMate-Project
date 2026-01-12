import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Protected Pages (for all roles)
import PatientDashboard from './pages/patient/PatientDashboard';
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import InsurerDashboard from './pages/insurer/InsurerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ConsentManagement from './pages/patient/ConsentManagement';
import GrantConsent from './pages/patient/GrantConsent';
import UploadDocuments from './pages/patient/UploadDocuments';
import ClaimTracking from './pages/patient/ClaimTracking';
import ClaimReview from './pages/insurer/ClaimReview';
import HospitalUpload from './pages/hospital/HospitalUpload';
import ModuleSelector from './components/ModuleSelector';

// Auth Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===================================================== */}
        {/* Public Routes - Anyone can access these               */}
        {/* ===================================================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/:role" element={<SignupPage />} />
        <Route path="/select-module" element={<ModuleSelector />} />

        {/* ===================================================== */}
        {/* Protected Routes - Only logged-in users can access    */}
        {/* ===================================================== */}

        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
        <Route path="/patient/consent" element={<ProtectedRoute><ConsentManagement /></ProtectedRoute>} />
        <Route path="/patient/grant-consent" element={<ProtectedRoute><GrantConsent /></ProtectedRoute>} />
        <Route path="/patient/upload-documents" element={<ProtectedRoute><UploadDocuments /></ProtectedRoute>} />
        <Route path="/patient/track-claims" element={<ProtectedRoute><ClaimTracking /></ProtectedRoute>} />

        {/* Hospital Routes */}
        <Route path="/hospital/dashboard" element={<ProtectedRoute><HospitalDashboard /></ProtectedRoute>} />
        <Route path="/hospital/upload" element={<ProtectedRoute><HospitalUpload /></ProtectedRoute>} />

        {/* Insurer Routes */}
        <Route path="/insurer/dashboard" element={<ProtectedRoute><InsurerDashboard /></ProtectedRoute>} />
        <Route path="/insurer/claim-review/:claimId" element={<ProtectedRoute><ClaimReview /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;