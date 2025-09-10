import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Import useParams
import axios from 'axios';
import '../AuthForm.css';

function SignupPage() {
    // Get the role from the URL parameter
    const { role: urlRole } = useParams();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // Set the initial role from the URL
    const [role, setRole] = useState(urlRole || ''); 
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // When the component loads, update the state if the URL role changes
    useEffect(() => {
        setRole(urlRole);
    }, [urlRole]);


    const validateForm = () => {
        // ... validation logic remains the same ...
        const newErrors = {};
        if (!fullName) newErrors.fullName = 'Full name is required';
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email address is invalid';
        }
        if (!phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be 10 digits';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!role) {
            newErrors.role = 'A role must be selected';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        // ... handleSubmit logic remains the same ...
        event.preventDefault();
        setSuccessMessage('');
        if (validateForm()) {
            try {
                const userData = { fullName, email, phoneNumber, password, role };
                const response = await axios.post('http://localhost:5000/api/register', userData);
                console.log('Server response:', response.data);
                setSuccessMessage('Account created successfully! Please log in.');
                // Clear form fields
                setFullName('');
                setEmail('');
                setPhoneNumber('');
                setPassword('');
                setConfirmPassword('');
                // Don't clear role, as it's from the URL
                setErrors({});
            } catch (error) {
                console.error('Signup error:', error);
                if (error.response && error.response.data) {
                    setErrors({ form: error.response.data.message || 'An error occurred during signup.' });
                } else {
                    setErrors({ form: 'Could not connect to the server.' });
                }
            }
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <h2>Create Your Account</h2>
                {errors.form && <p className="error-text">{errors.form}</p>}
                {successMessage && <p className="success-text" style={{color: 'green'}}>{successMessage}</p>}

                {/* The dropdown is now disabled so the user cannot change their selection */}
                <div className="input-group">
                    <label htmlFor="role">Register As</label>
                    <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required disabled>
                        <option value="">-- Select a Role --</option>
                        <option value="patient">Patient</option>
                        <option value="hospital">Hospital / Provider</option>
                        <option value="insurer">Insurer / TPA</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <p className="error-text">{errors.role}</p>}
                </div>

                <div className="input-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    {errors.fullName && <p className="error-text">{errors.fullName}</p>}
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                </div>
                <div className="input-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                    {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {errors.password && <p className="error-text">{errors.password}</p>}
                </div>
                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                </div>
                <button type="submit" className="btn-auth">Create Account</button>
                <p className="auth-switch">
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </form>
        </div>
    );
}

export default SignupPage;