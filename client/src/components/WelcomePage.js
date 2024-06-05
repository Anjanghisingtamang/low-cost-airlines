import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/logo.png';
import coverImage from '../assets/coverpage.jpg';
import '../css/WelcomePage.css';
import { FaUser } from 'react-icons/fa';

const WelcomePage = () => {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [seatClass, setSeatClass] = useState('Economy'); // Add state for seat class
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [destinations, setDestinations] = useState([]);
    const [fromAirport, setFromAirport] = useState('');
    const [toAirport, setToAirport] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
        const minDate = yyyy + '-' + mm + '-' + dd;
        setSelectedDate(minDate);

        // Check if user is logged in
        const authToken = localStorage.getItem('authToken');
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (authToken && userInfo) {
            setIsLoggedIn(true);
            setUsername(userInfo.UserName);
        }

        // Fetch destinations
        const fetchDestinations = async () => {
            try {
                const response = await axios.get('http://localhost:8080/Destinations');
                setDestinations(response.data);
            } catch (error) {
                console.error('Failed to fetch destinations:', error);
            }
        };

        fetchDestinations();
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

    const backgroundImageStyle = {
        backgroundImage: `url(${coverImage})`,
    };
    const fontSizeGroup = {
        fontSize: '18px'
    };

    const totalPassengers = adults + children;

    const handleSearchFlights = async (event) => {
        event.preventDefault();
        const searchParams = {
            searchDate: selectedDate,
            departureAirportcode: fromAirport,
            arrivalAirportcode: toAirport,
            numPassenger: totalPassengers,
            seatClass: seatClass, // Use dynamic seat class
        };

        try {
            const response = await axios.get('http://localhost:8080/Flights', { params: searchParams });
            const flights = response.data;
            localStorage.setItem('flights', JSON.stringify(flights)); // Store response in local storage
            navigate('/flightpage', { state: { flights } });
        } catch (error) {
            console.error('Failed to fetch flights:', error);
        }
    };

    return (
        <div className="welcome-page" style={backgroundImageStyle}>
            <header className="header">
                <img src={Logo} alt="Company Logo" className="logo" />
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
                            <Link to="/login" className="auth-link">Login</Link>
                            <Link to="/register" className="auth-link">Register</Link>
                        </>
                    )}
                </div>
            </header>
            <h1 className='welcome-heading'>Welcome to Low cost Airlines</h1>
            <p className="welcome-paragraph">Discover the best airlines to book for your next adventure. Experience the best flights ever with Low-Cost Airlines.</p>
            <div className="content-container">
                <div className="content">
                    <div className="search-flights">
                        <h2>Search Flights</h2>
                        <form onSubmit={handleSearchFlights}>
                            <div className="input-group">
                                <select
                                    value={fromAirport}
                                    onChange={(e) => setFromAirport(e.target.value)}
                                    style={fontSizeGroup}
                                    required
                                >
                                    <option value="" disabled>Select Airport from</option>
                                    {destinations.map((dest) => (
                                        <option key={dest.DestinationId} value={dest.AirportCode}>
                                            {dest.DestinationName} ({dest.AirportCode})
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={toAirport}
                                    onChange={(e) => setToAirport(e.target.value)}
                                    style={fontSizeGroup}
                                    required
                                >
                                    <option value="" disabled>Select Airport to</option>
                                    {destinations.map((dest) => (
                                        <option key={dest.DestinationId} value={dest.AirportCode}>
                                            {dest.DestinationName} ({dest.AirportCode})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <input type="date" placeholder="Departure" value={selectedDate} min={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={fontSizeGroup} required/>
                            <br />
                            <div className="dropdown-container" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div className="passenger-dropdown" style={{ ...fontSizeGroup, display: 'flex', alignItems: 'center' }}>
                                    <div style={{ marginRight: '10px' }}>
                                        <label>Adults:</label>
                                        <select value={adults} onChange={(e) => setAdults(parseInt(e.target.value))} style={fontSizeGroup}>
                                            {[...Array(10)].map((_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Children:</label>
                                        <select value={children} onChange={(e) => setChildren(parseInt(e.target.value))} style={fontSizeGroup}>
                                            {[...Array(5)].map((_, index) => (
                                                <option key={index} value={index}>{index}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label>Seat Class:</label>
                                    <select
                                        value={seatClass}
                                        onChange={(e) => setSeatClass(e.target.value)}
                                        style={fontSizeGroup}
                                        required
                                    >
                                        <option value="Economy">Economy</option>
                                        <option value="Business">Business</option>
                                        <option value="First class">First class</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" style={{ ...fontSizeGroup, backgroundColor: '#4CAF50', color: 'white' }}>Search Flights</button>
                        </form>
                        <p style={fontSizeGroup}>Total Passengers: {totalPassengers}</p>
                    </div>
                </div>
            </div>
            <footer className="footer">
                <p>© 2024 Low cost airlines</p>
            </footer>
        </div>
    );
};

export default WelcomePage;
