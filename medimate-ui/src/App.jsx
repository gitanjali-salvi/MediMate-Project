import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // Import the gatekeeper

// ... (all other imports remain the same) ...
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ModuleSelector from './components/ModuleSelector';
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
        {/* --- Public Routes --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/:role" element={<SignupPage />} />
        <Route path="/select-module" element={<ModuleSelector />} />

        {/* --- Protected Routes --- */}
        {/* All routes inside here can only be accessed if the user is logged in */}
        <Route path="/patient/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
        <Route path="/patient/upload-documents" element={<ProtectedRoute><UploadDocuments /></ProtectedRoute>} />
        <Route path="/patient/consent" element={<ProtectedRoute><ConsentManagement /></ProtectedRoute>} />
        <Route path="/patient/track-claims" element={<ProtectedRoute><ClaimTracking /></ProtectedRoute>} />
        
        <Route path="/hospital/dashboard" element={<ProtectedRoute><HospitalDashboard /></ProtectedRoute>} />
        <Route path="/hospital/upload" element={<ProtectedRoute><HospitalUpload /></ProtectedRoute>} />

        <Route path="/insurer/dashboard" element={<ProtectedRoute><InsurerDashboard /></ProtectedRoute>} />
        <Route path="/insurer/claim-review/:claimId" element={<ProtectedRoute><ClaimReview /></ProtectedRoute>} />
        
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;