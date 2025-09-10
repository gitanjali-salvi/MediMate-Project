import React from 'react';
import './LogoutModal.css'; // We will create this new CSS file

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirm Logout</h2>
                <p>Are you sure you want to log out of MediMate?</p>
                <div className="modal-actions">
                    <button onClick={onClose} className="modal-btn cancel-btn">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="modal-btn confirm-btn">
                        Yes, Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;