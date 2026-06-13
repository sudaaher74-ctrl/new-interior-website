import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  return (
    <>
      

  <div className="login-container">
    <div className="logo-container">
      <h1>OS Interior</h1>
      <p>Employee Portal Login</p>
    </div>

    <form id="loginForm">
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" placeholder="name@osinterior.com" required autocomplete="email" />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" placeholder="••••••••" required autocomplete="current-password" />
      </div>

      <div id="errorMsg" className="error-msg">Invalid email or password.</div>

      <button type="submit" className="btn-submit" id="submitBtn">
        <span id="btnText">Sign In</span>
        <div id="loadingSpinner" className="loading-spinner"></div>
      </button>
    </form>
  </div>

  
    </>
  );
};

export default Login;
