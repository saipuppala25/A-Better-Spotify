import React from 'react';

function Login() {
    const clientId = '49d03f30b8cf42448c6736ba547c7808'; 
    const redirectUri = encodeURIComponent('http://localhost:3000/auth/callback'); 

    // Spotify authorization endpoint URL
    const authEndpoint = 'https://accounts.spotify.com/authorize';

    // Query parameters
    const queryParams = new URLSearchParams({
        client_id: clientId,
        response_type: 'token', // or 'token' depending on your authentication flow
        redirect_uri: decodeURIComponent(redirectUri), // Decode the redirectUri before using it
    });

    // Final authorization URL
    const authUrl = `${authEndpoint}?${queryParams}`;

    return (
        <div className="App">
            <header className="App-header">
                <a className="btn-spotify" href={authUrl}>
                    Click here to login!
                </a>
            </header>
        </div>
    );
}

export default Login;
