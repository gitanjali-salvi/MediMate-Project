import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './HospitalUpload.css';

const HospitalUpload = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [uploadProgressMap, setUploadProgressMap] = useState({}); // Track progress per file
    const [actualPatientConsent, setActualPatientConsent] = useState(null); // null = unknown, true/false
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [patients, setPatients] = useState([]);
    const [isLoadingConsent, setIsLoadingConsent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch Patients on component mount
    useEffect(() => {
        const fetchPatients = async () => {
            if (!user) return;
            try {
                setError('');
                const response = await axios.get('http://localhost:5000/api/users/role/patient', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                setPatients(response.data);
            } catch (err) {
                console.error("Failed to fetch patients:", err);
                setError('Could not fetch patient list.');
            }
        };
        fetchPatients();
    }, [user]); //

    // Fetch Consent Status when selectedPatientId changes
    useEffect(() => {
        const checkPatientConsent = async () => {
            if (!selectedPatientId || !user) {
                setActualPatientConsent(null);
                return;
            }
            setIsLoadingConsent(true);
            setError('');
            setActualPatientConsent(null); // Reset while fetching
            try {
                const response = await axios.get(`http://localhost:5000/api/consents/hospital/patient/${selectedPatientId}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                // Check if at least one 'granted' consent exists
                const hasGrantedConsent = response.data.some(consent => consent.status === 'granted');
                setActualPatientConsent(hasGrantedConsent);
            } catch (err) {
                console.error("Failed to fetch patient consents:", err);
                setError('Could not fetch consent information for the selected patient.');
                setActualPatientConsent(false);
            } finally {
                setIsLoadingConsent(false);
            }
        };
        checkPatientConsent();
    }, [selectedPatientId, user]); //


    const documentTypes = [
        { key: 'admission', label: 'Admission Note', required: true },
        { key: 'discharge', label: 'Discharge Summary', required: true },
        { key: 'hospitalBills', label: 'Hospital Bills (Main + Breakup)', required: true },
        { key: 'receipts', label: 'Receipts', required: false },
        { key: 'pharmacy', label: 'Pharmacy Bills', required: false },
        { key: 'labReports', label: 'Lab Reports', required: false }
    ];

    const handleFileUpload = (docType, event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFiles(prev => ({ ...prev, [docType]: file }));
            setUploadProgressMap(prev => ({ ...prev, [docType]: 0 })); // Reset progress
            setError('');
            setSuccessMessage('');
        }
    };

    // --- Function to upload a single file (Hospital specific) ---
    const uploadFile = async (docType, file) => {
        if (!user || !user.token || !selectedPatientId) {
            throw new Error('User not authenticated or patient not selected');
        }

        const formData = new FormData();
        formData.append('document', file);
        formData.append('patientId', selectedPatientId); // Use selected patient ID
        formData.append('uploaderId', user.id); // Hospital user ID
        formData.append('docCategory', docType);

        try {
            const response = await axios.post('http://localhost:5000/api/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user.token}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgressMap(prev => ({ ...prev, [docType]: percentCompleted }));
                }
            });
            console.log(`Uploaded ${docType} for patient ${selectedPatientId}:`, response.data);
            return response.data; // Should include document ID, hash, CID etc.
        } catch (uploadError) {
            console.error(`Error uploading ${docType}:`, uploadError);
            setUploadProgressMap(prev => ({ ...prev, [docType]: -1 })); // Mark as failed
            throw uploadError;
        }
    };


    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        if (!actualPatientConsent) {
            setError('Patient consent is required before uploading records.');
            setIsSubmitting(false);
            return;
        }

        const requiredDocsUploaded = documentTypes
            .filter(doc => doc.required)
            .every(doc => uploadedFiles[doc.key]);

        if (!requiredDocsUploaded) {
            setError('Please upload all required documents (marked with *).');
            setIsSubmitting(false);
            return;
        }

        const filesToUpload = Object.entries(uploadedFiles);
        const uploadPromises = filesToUpload.map(([docType, file]) => uploadFile(docType, file));

        try {
            const uploadResults = await Promise.all(uploadPromises);
            const uploadedDocumentIds = uploadResults.map(result => result.document._id); // Adjust if needed

            console.log('All hospital files uploaded successfully. Results:', uploadResults);
            setSuccessMessage(`Records uploaded successfully for patient ID: ${selectedPatientId}`);

            // TODO: Potentially link these documents to an existing claim
            console.log('Uploaded Document IDs:', uploadedDocumentIds);
            
            setUploadedFiles({}); // Clear file list
            // setUploadProgressMap({}); // Clear progress map

        } catch (submissionError) {
            console.error('Submission failed:', submissionError);
            setError('One or more file uploads failed. Please check individual file statuses and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const uploadedCount = Object.keys(uploadedFiles).length;
    const totalDocs = documentTypes.length;
    // Determine if the submit button should be enabled
    const canSubmit = actualPatientConsent === true && uploadedCount > 0 && !isLoadingConsent && !isSubmitting;

    return (
        <div className="hospital-upload">
            <header className="upload-header">
                <Link to="/hospital/dashboard" className="back-btn">← Back</Link>
                <h1>Upload Hospital Records for Patient</h1>
            </header>

            <div className="upload-content">
                {error && <p className="error-text" style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', background: '#ffebee', padding: '0.5rem', borderRadius: '4px' }}>{error}</p>}
                {successMessage && <p className="success-text" style={{ color: 'green', textAlign: 'center', marginBottom: '1rem', background: '#e8f5e9', padding: '0.5rem', borderRadius: '4px' }}>{successMessage}</p>}


                <div className="patient-info">
                    <h3>Patient Information</h3>
                    <div className="patient-details">
                        <div className="patient-name">
                            <span className="label">Select Patient:</span>
                            <select
                                value={selectedPatientId}
                                onChange={(e) => setSelectedPatientId(e.target.value)}
                                className="patient-select"
                                disabled={patients.length === 0 || isSubmitting}
                            >
                                <option value="">-- Select a Patient --</option>
                                {patients.map(patient => (
                                    <option key={patient._id} value={patient._id}>
                                        {patient.fullName} (ID: {patient._id})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="consent-status">
                            <span className="label">Consent Status for Upload:</span>
                            {isLoadingConsent ? (
                                <span className="consent-badge" style={{ backgroundColor: '#eee', color: '#555' }}>⏳ Checking...</span>
                            ) : (
                                <span className={`consent-badge ${actualPatientConsent === true ? 'approved' : 'pending'}`}>
                                    {/* Show '--' if no patient is selected */}
                                    {actualPatientConsent === null ? '--' : (actualPatientConsent === true ? '✅ Consent Active' : '❌ Consent Not Found')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="document-upload-section">
                    <h3>Upload Medical Records</h3>
                    <div className="document-list">
                        {documentTypes.map((doc) => (
                            <div key={doc.key} className="document-item">
                                <label className="document-label">
                                    {doc.label} {doc.required && <span className="required">*</span>}
                                </label>
                                <div className="file-input-wrapper">
                                    <input
                                        type="file"
                                        id={doc.key}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload(doc.key, e)}
                                        className="file-input"
                                        disabled={actualPatientConsent !== true || isLoadingConsent || isSubmitting}
                                    />
                                    <label htmlFor={doc.key} className={`file-input-label ${actualPatientConsent !== true || isLoadingConsent || isSubmitting ? 'disabled' : ''}`}>
                                        {uploadedFiles[doc.key] ?
                                            `✓ ${uploadedFiles[doc.key].name}` :
                                            'Choose File'
                                        }
                                    </label>
                                    {/* --- Individual File Progress --- */}
                                     {uploadProgressMap[doc.key] > 0 && uploadProgressMap[doc.key] < 100 && (
                                        <div style={{ marginTop: '5px', fontSize: '0.8em', color: '#16a085' }}>Uploading: {uploadProgressMap[doc.key]}%</div>
                                    )}
                                    {uploadProgressMap[doc.key] === 100 && (
                                        <div style={{ marginTop: '5px', fontSize: '0.8em', color: 'green' }}>✓ Uploaded</div>
                                    )}
                                    {uploadProgressMap[doc.key] === -1 && (
                                        <div style={{ marginTop: '5px', fontSize: '0.8em', color: 'red' }}>✗ Upload Failed</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="upload-summary">
                    <div className="progress-info">
                        <span>Progress: {uploadedCount}/{totalDocs} document types selected</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${(uploadedCount / totalDocs) * 100}%` }} // Simple progress based on file selection
                        ></div>
                    </div>
                </div>

                <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={!canSubmit} // Button is enabled only if canSubmit is true
                >
                     {isSubmitting ? 'Uploading...' : 'Submit Hospital Records'}
                </button>

                {/* --- Contextual Warnings --- */}
                {actualPatientConsent === false && !isLoadingConsent && selectedPatientId && (
                    <div className="consent-warning">
                        <p>⚠️ Patient consent is required before uploading medical records. No active consent found for this patient.</p>
                    </div>
                )}
                 {!selectedPatientId && patients.length > 0 && !isSubmitting && (
                   <div className="consent-warning" style={{backgroundColor: '#e3f2fd', borderColor: '#90caf9', color: '#1565c0'}}>
                       <p>ℹ️ Please select a patient to check consent status and enable uploads.</p>
                   </div>
               )}
            </div>
        </div>
    );
};

export default HospitalUpload;