import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import '../AuthForm.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { login } = useAuth(); // Get the login function from context

    const validateForm = () => {
        // ... (validation logic remains the same)
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // if (validateForm()) { // You can uncomment this after testing
        try {
            const userData = { email, password };

            const response = await axios.post('http://localhost:5000/api/login', userData);
            const { token } = response.data;

            login(token); // Use the login function from context

            // Role-based redirect
            const { role } = response.data;
            if (role === 'patient') {
                navigate('/patient/dashboard');
            } else if (role === 'hospital') {
                navigate('/hospital/dashboard');
            } else if (role === 'insurer') {
                navigate('/insurer/dashboard');
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
        // }
    };

    // ... (return statement remains the same)
    return (
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
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;