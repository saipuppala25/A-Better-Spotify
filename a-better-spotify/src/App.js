import React, { useState, useEffect } from 'react';
import Login from './Login';
import './App.css';

function App() {
  const [token, setToken] = useState('');

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
    <div className="App">
      <div className="container">
        <h1>A Better Spotify</h1>
        <p>Welcome to your improved music experience!</p>
        {(token === '') ? <Login /> : <p>User is authenticated</p>}
      </div>
    </div>
  );
}

export default App;