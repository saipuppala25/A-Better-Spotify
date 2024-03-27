import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './pages/Home';
import Visuals from './Visuals';
import './App.css';
function App() {
  // Set the initial token state to the provided value
  const [token, setToken] = useState('');
  
  useEffect(() => {

    async function getToken() {
      const response = await fetch('/auth/token');
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();

  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={(token === '' || token == null) ? <Login /> : <Navigate replace to="/home" />} />
        <Route path="/home" element={(token === '' || token == null) ? <Navigate replace to="/" /> : <Home token={token}  setToken={setToken}/>} />
        <Route path="/visuals" element={<Visuals />} />
      </Routes>
    </Router>
  );
}

export default App;
