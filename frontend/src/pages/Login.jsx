import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api/config';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/v2/auth/login`, {
        email,
        password
      });

      // Save token and user details
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Route based on role
      if (res.data.user.role === 'Super Admin') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.msg) {
        setErrorMsg(err.response.data.msg);
      } else {
        setErrorMsg('Server error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <h1>OS Interior</h1>
        <p>Employee Portal Login</p>
      </div>

      <form onSubmit={handleSubmit} id="loginForm">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="name@osinterior.com" 
            required 
            autoComplete="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="••••••••" 
            required 
            autoComplete="current-password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMsg && <div className="error-msg" style={{display: 'block'}}>{errorMsg}</div>}

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <div className="loading-spinner" style={{display: 'inline-block'}}></div>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
