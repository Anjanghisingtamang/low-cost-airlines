import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/logo.png';
import coverImage from '../assets/coverpage.jpg';
import '../css/FlightPage.css';
import { FaUser } from 'react-icons/fa';

const FlightPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flights } = location.state;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (authToken && userInfo) {
      setIsLoggedIn(true);
      setUsername(userInfo.UserName);
    }
  }, []);

  const handleLogout = async () => {
    const authToken = localStorage.getItem('authToken');

    try {
      const response = await axios.put('http://localhost:8080/Logout', {}, {
        headers: {
          'X-Security-AuthKey': authToken,
        }
      });

      if (response.data.message && response.data.message.status === 440) {
        alert('Session Timeout');
      }

      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data.message && error.response.data.message.status === 440) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        setIsLoggedIn(false);
        alert('Session Timeout');
        navigate('/login');
      } else {
        console.error('Logout failed:', error);
      }
    }
  };

  const handleBookNow = async (flightId) => {
    try {
      const response = await axios.get(`http://localhost:8080/Seats?flightId=${flightId}`);
      const availableSeats = response.data;
      navigate('/seatPage', { state: { seatData: availableSeats } });

    } catch (error) {
      console.error('Error fetching seats:', error);
    }
  };

  const backgroundImageStyle = {
    backgroundImage: `url(${coverImage})`,
  };

  return (
    <div className="flight-page" style={backgroundImageStyle}>
      <header className="header">
        <Link to="/">
          <img src={Logo} alt="Company Logo" className="logo" />
        </Link>
        <div className="auth-links">
          {isLoggedIn ? (
            <>
              <div className="user-info">
                <FaUser />
                <span>{username}</span>
              </div>
              <button onClick={handleLogout} className="auth-link">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link">Log in</Link>
              <Link to="/register" className="auth-link">Register</Link>
            </>
          )}
        </div>
      </header>
      <div className="flight-list">
        <h2>Available Flights</h2>
        <table>
          <thead>
            <tr>
              <th>Departure Date</th>
              <th>Departure Time</th>
              <th>Arrival Date</th>
              <th>Arrival Time</th>
              <th>Total Seats</th>
              <th>Available Seats</th>
              <th>Aircraft Name</th>
              <th>Departure Airport</th>
              <th>Arrival Airport</th>
              <th>Action</th>
            </tr>
          </thead>
          {flights.length > 0 ? (
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.FlightId}>
                  <td>{new Date(flight.DepatureDateTime).toLocaleDateString()}</td>
                  <td>{new Date(flight.DepatureDateTime).toLocaleTimeString()}</td>
                  <td>{new Date(flight.ArrivalDateTime).toLocaleDateString()}</td>
                  <td>{new Date(flight.ArrivalDateTime).toLocaleTimeString()}</td>
                  <td>{flight.TotalSeat}</td>
                  <td>{flight.AvailableSeats}</td>
                  <td>{flight.AircraftDetails.AircraftName}</td>
                  <td>{flight.DepatureDetails.DestinationName} ({flight.DepatureDetails.AirportCode})</td>
                  <td>{flight.ArivalDetails.DestinationName} ({flight.ArivalDetails.AirportCode})</td>
                  <td>
                    <button onClick={() => handleBookNow(flight.FlightId)} className="book-link">Book Now</button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="10">No Flights Available</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <footer className="footer">
        <p>© 2024 Low cost airlines</p>
      </footer>
    </div>
  );
};

export default FlightPage;
