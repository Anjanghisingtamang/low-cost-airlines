import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/logo.png';
import coverImage from '../assets/coverpage.jpg';
import { CountryDropdown } from 'react-country-region-selector';
import '../css/RegisterPage.css';

const RegistrationPage = () => {
    const navigate = useNavigate();
    const [selectedCountry, setSelectedCountry] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        emailAddress: '',
        phoneNumber: '',
        mobileNumber: '',
        passportNumber: '',
        passportExpiryDate: '',
        userName: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCountryChange = (val) => {
        setSelectedCountry(val);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            UserName: formData.userName,
            FirstName: formData.firstName,
            MiddleName: formData.middleName,
            LastName: formData.lastName,
            DateOfBirth: formData.dateOfBirth,
            EmailAddress: formData.emailAddress,
            PhoneNumber: formData.phoneNumber,
            MobileNumber: formData.mobileNumber,
            PassportNumber: formData.passportNumber,
            PassportExpieryDate: formData.passportExpiryDate,
            Country: selectedCountry,
            Password: formData.password,
        };

        try {
            const response = await axios.post('http://localhost:8080/users', data);
            console.log('Registration successful:', response.data);
            // Handle successful registration (e.g., redirect to login)
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const backgroundImageStyle = {
        backgroundImage: `url(${coverImage})`,
    };

    return (
        <div className="registration-page" style={backgroundImageStyle}>
            <header className="header">
                <Link to="/">
                    <img src={Logo} alt="Company Logo" className="logo" />
                </Link>
                <div className="auth-links">
                    <Link to="/login" className="auth-link">Login</Link>
                    <Link to="/register" className="auth-link">Register</Link>
                </div>
            </header>
            <div className="registration-form">
                <h2>Create an Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
                        <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleInputChange} />
                        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <input type="date" name="dateOfBirth" placeholder="Date of Birth" value={formData.dateOfBirth} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <input type="email" name="emailAddress" placeholder="Email Address" value={formData.emailAddress} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} />
                        <input type="tel" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                        <input type="text" name="passportNumber" placeholder="Passport Number" value={formData.passportNumber} onChange={handleInputChange} required/>
                        <input type="date" name="passportExpiryDate" placeholder="Passport Expiry Date" value={formData.passportExpiryDate} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <input type="text" name="userName" placeholder="Username" value={formData.userName} onChange={handleInputChange} required />
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <CountryDropdown
                            value={selectedCountry}
                            onChange={(val) => handleCountryChange(val)}
                            priorityOptions={['US', 'CA', 'GB']} // Optional: prioritize certain countries
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
            <footer className="footer">
                <p>© 2024 Low cost airlines</p>
            </footer>
        </div>
    );
};

export default RegistrationPage;
