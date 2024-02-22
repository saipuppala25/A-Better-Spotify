import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './pages/Home';
import Visuals from './Visuals';
import './App.css';

function App() {
  // Set the initial token state to the provided value
  const token = 'BQBsquyh87v0fGwMXz-avefCA6Xlv2ifYJpQLdOwQ5WetCyX066E6c7RmILNdiaJHBB1wiwbkJ3gYUyhd4HReKp6s5U9JD2WYwHlASH_xmKz3Lq3l-xFBz1Qa3aWX8x2R-TojH3JfggtvFHn6yosRA-vKZ2XMWpElYyXZQb35ArZ1vnDNjzWs-RENQecbgA9BPo6i3ytkAL6AS67v8iZtd_TvKLQueQPybcTfbJ3OFgdbiDqOgVZ313g3gILYu70pq0'
  useEffect(() => {
    async function getToken() {
      try {
        const response = await fetch('/auth/token');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        //you need to comment out set token if you have the token already
       // setToken(json.access_token); // Update the token state if fetch is successful
      } catch (e) {
        console.error('Failed to fetch new token:', e);
    
      }
    }

    getToken();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={!token ? <Login /> : <Navigate replace to="/home" />} />
        <Route path="/home" element={!token ? <Navigate replace to="/" /> : <Home token={token} />} />
        <Route path="/visuals" element={!token ? <Navigate replace to="/" /> : <Visuals />} />
      </Routes>
    </Router>
  );
}

export default App;
