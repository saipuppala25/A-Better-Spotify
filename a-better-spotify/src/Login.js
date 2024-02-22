import React from 'react';
import './css/login.css'; 

function Login() {
    return (
        <div className="login-container">
            <header className="login-header">
                <h1>Welcome to A Better Spotify.</h1>
                <a className="btn-spotify" href="/auth/login">
                    Login with Spotify
                </a>
            </header>
        </div>
    );
}

export default Login;