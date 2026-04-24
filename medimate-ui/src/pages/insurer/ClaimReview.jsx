import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Web3 from 'web3';
import { useAuth } from '../../context/AuthContext';
import DocumentRegistryABI from '../../contracts/DocumentRegistry.json';
import './ClaimReview.css';

const ClaimReview = () => {
    const { claimId } = useParams(); // Retrieves MongoDB ID from URL
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // State Management
    const [claim, setClaim] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [extractedData, setExtractedData] = useState(null);
    const [blockchainStatus, setBlockchainStatus] = useState({}); // Track verification for each doc

    // 1. Fetch Claim Details from MongoDB
    useEffect(() => {
        const fetchClaimDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/claims/${claimId}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                setClaim(res.data);
                if (res.data.aiExtractedData) setExtractedData(res.data.aiExtractedData);
            } catch (err) {
                console.error("Error fetching claim:", err);
            }
        };
        fetchClaimDetails();
    }, [claimId, user.token]);

    // 2. Blockchain Verification Logic
    const verifyOnBlockchain = async (docHash, docId) => {
        try {
            const web3 = new Web3(Web3.givenProvider || "http://localhost:7545"); // Connect to Ganache
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = DocumentRegistryABI.networks[networkId];
            
            if (!deployedNetwork) {
                alert("Smart contract not detected on this network.");
                return;
            }

            const contract = new web3.eth.Contract(
                DocumentRegistryABI.abi,
                deployedNetwork.address
            );

            // Call getDocument from DocumentRegistry.sol
            const result = await contract.methods.getDocument(docHash).call();
            
            // Map the result from the struct: documentHash, ipfsCid, fileName, patientId, timestamp
            setBlockchainStatus(prev => ({
                ...prev,
                [docId]: {
                    verified: true,
                    ipfsCid: result.ipfsCid,
                    timestamp: new Date(result.timestamp * 1000).toLocaleString(),
                    owner: result.owner
                }
            }));
        } catch (err) {
            console.error("Blockchain verification failed:", err);
            setBlockchainStatus(prev => ({
                ...prev,
                [docId]: { verified: false, error: "Record not found on Ledger" }
            }));
        }
    };

    // 3. Mock AI Analysis Trigger
    const runAIExtraction = async () => {
        setLoadingAI(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/claims/${claimId}/simulate-extraction`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            
            // Visual delay for demo effect
            setTimeout(() => {
                setExtractedData(res.data);
                setLoadingAI(false);
            }, 2000);
        } catch (err) {
            console.error("AI Extraction failed:", err);
            setLoadingAI(false);
        }
    };

    if (!claim) return <div className="loading">Loading Claim Details...</div>;

    return (
        <div className="claim-review-container">
            <h2>Claim Review: {claim.claimId}</h2>
            
            <div className="review-grid">
                {/* Left Panel: Source Data & Blockchain Verification */}
                <div className="panel submission-panel">
                    <h3>Source Evidence</h3>
                    <p><strong>Patient:</strong> {claim.patientId?.fullName}</p>
                    <div className="doc-list">
                        <h4>Decentralized Records</h4>
                        {claim.documentIds.map(doc => (
                            <div key={doc._id} className="blockchain-card">
                                <div className="doc-header">
                                    <span>📄 {doc.fileName}</span>
                                    <button 
                                        onClick={() => verifyOnBlockchain(doc.documentHash, doc._id)}
                                        className="verify-btn"
                                    >
                                        Verify Ledger
                                    </button>
                                </div>
                                
                                {blockchainStatus[doc._id] && (
                                    <div className="verification-details fade-in">
                                        {blockchainStatus[doc._id].verified ? (
                                            <>
                                                <p className="status-ok">✅ Integrity Verified</p>
                                                <p><small>IPFS: {blockchainStatus[doc._id].ipfsCid}</small></p>
                                                <p><small>Ledger Time: {blockchainStatus[doc._id].timestamp}</small></p>
                                            </>
                                        ) : (
                                            <p className="status-fail">❌ {blockchainStatus[doc._id].error}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={runAIExtraction} className="ai-btn" disabled={loadingAI}>
                        {loadingAI ? "Analyzing Documents..." : "🪄 Run AI Extraction"}
                    </button>
                </div>

                {/* Right Panel: Policy Document (Simulated AI Results) */}
                <div className="panel ai-panel">
                    <h3>AI Policy Generation</h3>
                    {loadingAI ? (
                        <div className="spinner-container">
                            <div className="loader"></div>
                            <p>Processing with MediMate AI...</p>
                        </div>
                    ) : extractedData ? (
                        <div className="policy-form fade-in">
                            <div className="form-group">
                                <label>Patient Full Name</label>
                                <input type="text" readOnly value={extractedData.patientName} />
                            </div>
                            <div className="form-group">
                                <label>Provider/Hospital</label>
                                <input type="text" readOnly value={extractedData.hospitalName} />
                            </div>
                            <div className="form-group">
                                <label>Total Claimable Amount</label>
                                <input type="text" readOnly value={`₹${extractedData.totalBillAmount}`} />
                            </div>
                            <div className="form-group">
                                <label>Diagnosis Code</label>
                                <input type="text" readOnly value={extractedData.diagnosisCode} />
                            </div>
                            <div className="actions">
                                <button className="approve-btn" onClick={() => navigate('/insurer/dashboard')}>Approve</button>
                                <button className="reject-btn" onClick={() => navigate('/insurer/dashboard')}>Reject</button>
                            </div>
                        </div>
                    ) : (
                        <div className="placeholder">
                            <p>Run analysis to view extracted policy details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClaimReview;