import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../AuthForm.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // ... (validateForm function remains the same)
    const validateForm = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email address is invalid';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                const userData = { email, password };
                
                const response = await axios.post('http://localhost:5000/api/login', userData);

                // --- UPDATED TO RECEIVE AND STORE NAME ---
                const { token, role, fullName } = response.data;

                // Store both the token and the user's name
                localStorage.setItem('token', token);
                localStorage.setItem('userName', fullName);

                // Role-Based Redirect
                if (role === 'patient') {
                    navigate('/patient/dashboard');
                } else if (role === 'hospital') {
                    navigate('/hospital/dashboard');
                } else if (role === 'insurer') {
                    navigate('/insurer/dashboard');
                } else if (role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/'); 
                }

            } catch (error) {
                console.error('Login error:', error);
                if (error.response && error.response.data) {
                    setErrors({ form: error.response.data.message || 'An error occurred during login.' });
                } else {
                    setErrors({ form: 'Could not connect to the server.' });
                }
            }
        }
    };

    return (
        // ... (The JSX for your login form remains the same)
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <h2>Welcome Back!</h2>
                <p>Log in to access your MediMate account.</p>
                
                {errors.form && <p className="error-text">{errors.form}</p>}

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}
                </div>

                <button type="submit" className="btn-auth">Login</button>
                <p className="auth-switch">
                    Don't have an account? <Link to="/select-module">Sign Up</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;