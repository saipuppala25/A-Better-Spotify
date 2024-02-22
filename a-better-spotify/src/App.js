import React, { useState, useEffect } from 'react';
import Login from './Login';
import './App.css';
import Home from './pages/Home';

function App() {
  const [token, setToken] = useState('sadaffas');

  useEffect(() => {
    async function getToken() {
      try {
        const response = await fetch('/auth/token');
        const json = await response.json();
        setToken(json.access_token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    }

    getToken();
  }, []);

  return (
    (token === '' || token ==null) ? <Login /> : <Home/>
  )
}

export default App;