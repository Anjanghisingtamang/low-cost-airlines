import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/logo.png';
import coverImage from '../assets/coverpage.jpg';
import '../css/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const backgroundImageStyle = {
    backgroundImage: `url(${coverImage})`,
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    const loginData = {
      UserName: username,
      Password: password,
    };

    try {
      const response = await axios.post('http://localhost:8080/Login', loginData);

      const data = response.data;
      localStorage.setItem('authToken', data.AuthenticationKey);
      localStorage.setItem('userInfo', JSON.stringify(data));

      // Navigate to the welcome page
      navigate('/');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message.details);
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-page" style={backgroundImageStyle}>  
      <header className="header">
        <Link to="/">
          <img src={Logo} alt="Company Logo" className="logo" />
        </Link>
        <div className="auth-links">
          <Link to="/login" className="auth-link">Login</Link>
          <Link to="/register" className="auth-link">Register</Link>
        </div>
      </header>
      <div className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="forgot-password">
            <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
      <footer className="footer">
        <p>© 2024 Low cost airlines</p>
      </footer>
    </div>
  );
};

export default LoginPage;
