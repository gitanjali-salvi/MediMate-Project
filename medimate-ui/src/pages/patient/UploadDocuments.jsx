import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import axios from 'axios'; // Added axios
import { useAuth } from '../../context/AuthContext'; // Added useAuth
import './UploadDocuments.css';

const UploadDocuments = () => {
    const { user } = useAuth(); // Get user context for authentication token and ID
    const navigate = useNavigate(); // Hook for navigation
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [uploadProgressMap, setUploadProgressMap] = useState({}); // Track progress per file
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const documentTypes = [
        { key: 'insurance', label: 'Insurance Policy/E-card', required: true },
        { key: 'idProof', label: 'ID Proof (Aadhaar, PAN, etc.)', required: true },
        { key: 'admission', label: 'Admission Note', required: true },
        { key: 'discharge', label: 'Discharge Summary', required: true },
        { key: 'hospitalBill', label: 'Hospital Bill + Breakup', required: true },
        { key: 'pharmacy', label: 'Pharmacy Bills', required: false },
        { key: 'labReports', label: 'Lab Reports', required: false },
        { key: 'prescriptions', label: 'Prescriptions', required: false }
    ];

    const handleFileUpload = (docType, event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFiles(prev => ({
                ...prev,
                [docType]: file
            }));
            // Reset progress for this file type if re-uploading
            setUploadProgressMap(prev => ({ ...prev, [docType]: 0 }));
            setError(''); // Clear error on new file selection
            setSuccessMessage(''); // Clear success message
        }
    };

    // --- Function to upload a single file ---
    const uploadFile = async (docType, file) => {
        if (!user || !user.token) {
            throw new Error('User not authenticated');
        }

        const formData = new FormData();
        formData.append('document', file); // 'document' matches 'upload.single('document')' in backend
        formData.append('patientId', user.id); // The patient is uploading for themselves
        formData.append('uploaderId', user.id); // The patient is the uploader
        formData.append('docCategory', docType); // Send the category (e.g., 'admission', 'idProof')

        try {
            const response = await axios.post('http://localhost:5000/api/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user.token}` // Send auth token
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgressMap(prev => ({ ...prev, [docType]: percentCompleted }));
                }
            });
            console.log(`Uploaded ${docType}:`, response.data);
            return response.data; // Return data (includes document, hash, CID, etc.)
        } catch (uploadError) {
            console.error(`Error uploading ${docType}:`, uploadError);
            // Set progress to -1 to indicate error for this file
            setUploadProgressMap(prev => ({ ...prev, [docType]: -1 }));
            throw uploadError; // Re-throw to be caught in handleSubmit
        }
    };


    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        // Check if all *required* documents have been selected
        const requiredDocsUploaded = documentTypes
            .filter(doc => doc.required)
            .every(doc => uploadedFiles[doc.key]);

        if (!requiredDocsUploaded) {
            setError('Please upload all required documents (marked with *).');
            setIsSubmitting(false);
            return;
        }

        // Create an array of promises, one for each file to be uploaded
        const filesToUpload = Object.entries(uploadedFiles);
        const uploadPromises = filesToUpload.map(([docType, file]) => uploadFile(docType, file));

        try {
            // Wait for all uploads to complete successfully
            const uploadResults = await Promise.all(uploadPromises);
            
            // Extract the new MongoDB document IDs from the results
            // Note: 'response.data.document._id' matches the backend route's response
            const uploadedDocumentIds = uploadResults.map(result => result.document._id); 

            console.log('All files uploaded successfully. Results:', uploadResults);
            
            // --- TODO: Next Step: Claim Creation ---
            // Now that documents are uploaded, you would typically:
            // 1. Grant consent (if not already done).
            // 2. Create a claim record that links these document IDs.
            // For now, we'll just show a success message.
            console.log('Uploaded Document IDs to be used in a claim:', uploadedDocumentIds);
            
            setSuccessMessage('All documents submitted successfully!');
            setUploadedFiles({}); // Clear the file list
            
            // Optional: Redirect after success
            // setTimeout(() => navigate('/patient/track-claims'), 2000);

        } catch (submissionError) {
            console.error('Submission failed:', submissionError);
            setError('One or more file uploads failed. Please check individual file statuses and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    // Calculate overall progress based on selected files (not upload status)
    const selectedCount = Object.keys(uploadedFiles).length;
    const requiredSelectedCount = documentTypes.filter(doc => doc.required && uploadedFiles[doc.key]).length;
    const totalRequired = documentTypes.filter(doc => doc.required).length;
    // Simple progress based on required files selected
    const progressPercentage = totalRequired > 0 ? (requiredSelectedCount / totalRequired) * 100 : (selectedCount > 0 ? 100 : 0);


    return (
        <div className="upload-documents">
            <header className="upload-header">
                <Link to="/patient/dashboard" className="back-btn">← Back</Link>
                <h1>Upload Your Documents</h1>
            </header>

            <div className="upload-content">
                {/* --- UI Feedback Banners --- */}
                {error && <p className="error-text" style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', background: '#ffebee', padding: '0.5rem', borderRadius: '4px' }}>{error}</p>}
                {successMessage && <p className="success-text" style={{ color: 'green', textAlign: 'center', marginBottom: '1rem', background: '#e8f5e9', padding: '0.5rem', borderRadius: '4px' }}>{successMessage}</p>}

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
                                    disabled={isSubmitting} // Disable while submitting
                                />
                                <label htmlFor={doc.key} className={`file-input-label ${isSubmitting ? 'disabled' : ''}`}>
                                    {uploadedFiles[doc.key] ?
                                        `✓ ${uploadedFiles[doc.key].name}` :
                                        'Choose File'
                                    }
                                </label>
                                {/* --- Individual File Progress --- */}
                                {uploadProgressMap[doc.key] > 0 && uploadProgressMap[doc.key] < 100 && (
                                    <div style={{ marginTop: '5px', fontSize: '0.8em', color: '#667eea' }}>Uploading: {uploadProgressMap[doc.key]}%</div>
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

                <div className="progress-section">
                    <div className="progress-bar-container">
                        <div className="progress-label">
                            Required Documents Selected: {requiredSelectedCount}/{totalRequired}
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={isSubmitting || Object.keys(uploadedFiles).length === 0} // Disable if submitting or no files selected
                >
                    {isSubmitting ? 'Uploading...' : 'Submit All Documents'}
                </button>
            </div>
        </div>
    );
};

export default UploadDocuments;