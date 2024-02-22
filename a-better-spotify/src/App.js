import React, { useState, useEffect } from 'react';
import Login from './Login';
import './App.css';
import Home from './pages/Home';

function App() {
  const [token, setToken] = useState('BQBcTZVrOIrA6ziqYAz5WHYp54bhqtes8qlOh0fHH52D6pJbR_r4AGdaPrRVFJDymT28dOHEd70r6GguP5ouOtLw9qLDMKeH_kka19abYbyTqhhIQAkrWf7y5onoB9zdf3lZGHlWqqQKpPXO_yPZUHzYV5pFYUlELogAV_PMR76dRnu-1THPQJSzACvoFfRQ0VdhN29EkePMA0JX2FtjEnL1SDuT1Bz7JLkzJhoGdmxsvM2qTyhT3z8L8mff7-95B2se4O0');

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

    //getToken();
  }, []);

  return (
    (token === '' || token == null) ? <Login /> : <Home token={token}/>
  )
}

export default App;