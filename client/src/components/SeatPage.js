import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/logo.png';
import coverImage from '../assets/coverpage.jpg';
import '../css/SeatPage.css';
import { FaUser } from 'react-icons/fa';

const SeatPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [seatData, setSeatData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (authToken && userInfo) {
            setIsLoggedIn(true);
            setUsername(userInfo.UserName);
        }

        // Extract seat data from location state
        if (location.state && location.state.seatData) {
            setSeatData(location.state.seatData);
        }

        // Check for expired seat locks on initial load
        checkExpiredSeatLocks();

    }, [location.state]);

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

    const handleSeatClick = (seatNumber) => {
        const now = Date.now();
        const seatLock = JSON.parse(localStorage.getItem('seatLock')) || {};

        if (isLoggedIn) {
            
            if (selectedSeats.length >= 6) {
                alert('You can only select up to 6 seats. Proceed to book the selected seats. And make the payment.');
                return;
            }

            if (seatNumber === '10A' || seatNumber === '10F') {
                const isFireExit = window.confirm('Are you responsible for the fire exit door?');
                if (!isFireExit) {
                    alert('You cannot select this seat as you are not responsible for the fire exit door.');
                    return;
                }
            }

            if (!isSeatAvailable(seatNumber)) {
                alert('This seat is alredy booked by someone.');
                return;
            }

            if (!hasAdjacentSelected(seatNumber)) {
                alert('Please select adjacent seats first.');
                return;
            }


            setSelectedSeats(prevSeats => {
                const isSeatSelected = prevSeats.some(seat => seat.seatNumber === seatNumber);

                if (isSeatSelected) {
                    // Deselect the seat
                    return prevSeats.filter(seat => seat.seatNumber !== seatNumber);
                } else {
                    // Select the seat
                    return [
                        ...prevSeats,
                        { seatNumber, passengerName: '', isChild: false, price: '' }
                    ];
                }
            });
        } else {
            if (seatLock[seatNumber] && (now - seatLock[seatNumber]) < 10 * 60 * 1000) {
                alert('This seat is locked. Please wait for the lock to expire.');
                return;
            } else {
                // Lock the seat
                seatLock[seatNumber] = now;
                localStorage.setItem('seatLock', JSON.stringify(seatLock));
                alert('Seat locked for 10 minutes. Please log in to book.');
                navigate('/login');
            }
        }
    };

    const checkExpiredSeatLocks = () => {
        const now = Date.now();
        const seatLock = JSON.parse(localStorage.getItem('seatLock')) || {};
        let updated = false;

        for (const seat in seatLock) {
            if ((now - seatLock[seat]) >= 10 * 60 * 1000) {
                delete seatLock[seat];
                updated = true;
            }
        }

        if (updated) {
            localStorage.setItem('seatLock', JSON.stringify(seatLock));
        }
    };


    const handlePassengerInfoChange = (index, field, value) => {
        const updatedSeats = [...selectedSeats];
        updatedSeats[index][field] = value;
        setSelectedSeats(updatedSeats);
    };

    const hasAdjacentSelected = (seatNumber) => {
        const row = parseInt(seatNumber.substring(0, seatNumber.length - 1)); // Extract row number
        const column = seatNumber.charAt(seatNumber.length - 1); // Extract column letter
        const columnIndex = column.charCodeAt(0) - 'A'.charCodeAt(0); // Convert column letter to index

        // Find the seats in the row
        const rowSeats = seatRows.find(rowArr => rowArr.some(seat => seat.startsWith(row)));
        if (!rowSeats)
            return false;

        const filteredrowSeats = [];

        if (selectedSeats.length === 0) {
            for (let i = 0; i < rowSeats.length; i++) {
                if (isSeatAvailable(rowSeats[i])) {
                    filteredrowSeats.push(rowSeats[i]);
                }
            }
            if (filteredrowSeats.length > 0) {
                let leftmostValue = filteredrowSeats[0];
                let rightmostValue = filteredrowSeats[filteredrowSeats.length - 1];

                if (filteredrowSeats.length === 1) {
                    // If there's only one seat, leftmost and rightmost are the same
                    rightmostValue = leftmostValue;
                }

                if (leftmostValue == seatNumber || rightmostValue == seatNumber) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            const selectedSeatRows = [];
            const filteredrowSeats = []
            for (const row of seatRows) {
                const selectedInRow = selectedSeats.some(
                    (seat) => row.includes(seat.seatNumber)
                );

                if (selectedInRow) {
                    selectedSeatRows.push(row);
                }
            }
            let selectedrowindex = selectedSeatRows.length -1;
            if (selectedSeatRows[selectedrowindex].length
                > 0) {
                for (let i = 0; i < selectedSeatRows[0].length
                    ; i++) {
                    if (isSeatAvailable(selectedSeatRows[selectedrowindex][i]) && !(selectedSeats.some(selected => selected.seatNumber === selectedSeatRows[selectedrowindex][i]))) {
                        filteredrowSeats.push(selectedSeatRows[selectedrowindex][i]);
                    }
                }
                if (filteredrowSeats.length > 0) {
                    let leftmostValue = filteredrowSeats[0];
                    let rightmostValue = filteredrowSeats[filteredrowSeats.length - 1];

                    if (filteredrowSeats.length === 1) {
                        // If there's only one seat, leftmost and rightmost are the same
                        rightmostValue = leftmostValue;
                    }

                    if (leftmostValue == seatNumber || rightmostValue == seatNumber) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    for (let i = 0; i < rowSeats.length; i++) {
                        if (isSeatAvailable(rowSeats[i])) {
                            filteredrowSeats.push(rowSeats[i]);
                        }
                    }
                    if (filteredrowSeats.length > 0) {
                        let leftmostValue = filteredrowSeats[0];
                        let rightmostValue = filteredrowSeats[filteredrowSeats.length - 1];

                        if (filteredrowSeats.length === 1) {
                            // If there's only one seat, leftmost and rightmost are the same
                            rightmostValue = leftmostValue;
                        }

                        if (leftmostValue == seatNumber || rightmostValue == seatNumber) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }

            }
            return false
        }
        return false; // Default return if no conditions are met
    }

    const isSeatAvailable = (seatNumber) => {
        return seatData.some(seat => seat.SeatNumber === seatNumber);
    };

    const backgroundImageStyle = {
        backgroundImage: `url(${coverImage})`,
    };

    const seatRows = [
        ['1A', '1B', '1C', '1D'],
        ['2A', '2B', '2C', '2D'],
        ['3A', '3B', '3C', '3D'],
        ['4A', '4B', '4C', '4D', '4E', '4F'],
        ['5A', '5B', '5C', '5D', '5E', '5F'],
        ['6A', '6B', '6C', '6D', '6E', '6F'],
        ['7A', '7B', '7C', '7D', '7E', '7F'],
        ['8A', '8B', '8C', '8D', '8E', '8F'],
        ['9A', '9B', '9C', '9D', '9E', '9F'],
        ['10A', '10B', '10C', '10D', '10E', '10F'],
        ['11A', '11B', '11C', '11D', '11E', '11F'],
        ['12A', '12B', '12C', '12D', '12E', '12F'],
        ['13A', '13B', '13C', '13D', '13E', '13F'],
        ['14A', '14B', '14C', '14D', '14E', '14F'],
        ['15A', '15B', '15C', '15D', '15E', '15F'],
        ['16A', '16B', '16C', '16D', '16E', '16F'],
        ['17A', '17B', '17C', '17D', '17E', '17F'],
        ['18A', '18B', '18C', '18D', '18E', '18F'],
        ['19A', '19B', '19C', '19D', '19E', '19F'],
        ['20B', '20C', '20D', '20E'],
    ];

    const getSeatClass = (seatNumber) => {
        if (!isSeatAvailable(seatNumber)) return 'unavailable';
        if ((seatNumber.startsWith('1') || seatNumber.startsWith('2') || seatNumber.startsWith('3')) && seatNumber.length === 2) return 'first';
        if (seatNumber.startsWith('4') || seatNumber.startsWith('5') || seatNumber.startsWith('6') || seatNumber.startsWith('7') && seatNumber.length === 2) return 'business';
        return 'economy';
    };

    const handleCancel = () => {
        setSelectedSeats([]);
    };
    const getTotalPrice = () => {
        let totalPrice = 0;
        selectedSeats.forEach(seat => {
            totalPrice += calculateSeatPrice(seat.seatNumber, seat.isChild);
        });
        return totalPrice;
    };

    const calculateSeatPrice = (seatNumber, isChild) => {
        const seatClass = getSeatClass(seatNumber);
        let price;
        switch (seatClass) {
            case 'economy':
                price = isChild ? 400 * 0.5 : 400;
                break;
            case 'business':
                price = isChild ? 600 * 0.5 : 600;
                break;
            case 'first':
                price = isChild ? 800 * 0.5 : 800;
                break;
            default:
                price = 0;
        }
        return price;
    };

    return (
        <div className="seat-page" style={backgroundImageStyle}>
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
            <div className="container">
                <div className="book-seat">
                    <h2>Selected Seats</h2>
                    <ul>
                        {selectedSeats.map((seat, index) => (
                            <li key={index}>
                                <div>Seat: {seat.seatNumber}</div>
                                {/* Display passenger name, isChild checkbox, and price */}
                                {/* For example */}
                                <input
                                    type="text"
                                    placeholder="Passenger Full Name"
                                    value={seat.passengerName}
                                    onChange={(e) => handlePassengerInfoChange(index, 'passengerName', e.target.value)}
                                />
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={seat.isChild}
                                        onChange={(e) => handlePassengerInfoChange(index, 'isChild', e.target.checked)}
                                    />
                                    Is Child
                                </label>
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={calculateSeatPrice(seat.seatNumber, seat.isChild)}
                                    readOnly
                                />
                            </li>
                        ))}
                    </ul>
                    <div>Total Price: £{getTotalPrice()}</div>
                    <button>Book Seats</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
                <div className="seat-map">
                    <h2>Available Seats</h2>
                    <div className="legend">
                        <div className="legend-item">
                            <div className="seat unavailable"></div>
                            Unavailable Seat
                        </div>
                        <div className="legend-item">
                            <div className="seat first"></div>
                            First Class
                        </div>
                        <div className="legend-item">
                            <div className="seat business"></div>
                            Business Class
                        </div>
                        <div className="legend-item">
                            <div className="seat economy"></div>
                            Economy Class
                        </div>
                    </div>
                    <div className="seats">
                        {seatRows.map((row, rowIndex) => (
                            <div key={rowIndex} className="seat-row">
                                {row.map(seatNumber => (
                                    <div
                                        key={seatNumber}
                                        className={`seat ${getSeatClass(seatNumber)} ${selectedSeats.find(seat => seat.seatNumber === seatNumber) ? 'selected' : ''}`}
                                        onClick={() => handleSeatClick(seatNumber)}
                                    >
                                        {seatNumber}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <footer className="footer">
                <p>© 2024 Low cost airlines</p>
            </footer>
        </div>
    );
};

export default SeatPage;
