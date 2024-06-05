import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import GuestPage from './components/GuestPage';
import FlightPage from './components/FlightPage';
import SeatPage from './components/SeatPage';
import BookingPage from './components/BookingPage';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/guest" element={<GuestPage />} />
          <Route path="/flightpage" element={<FlightPage />} />
          <Route path="/seatPage" element={<SeatPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
