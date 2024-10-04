import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Home from "./pages/Home";
import TopTracksPage from "./pages/TopTracksPage";
import TopBar from "./component/TopBar";
import TopArtistsPage from "./pages/TopArtistsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import MoodsPage from "./pages/MoodsPage"
import Mode from "./pages/Mode"; // Import the Mode component

import "./App.css";

function App() {
  const [token, setToken] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  ); // Initialize with stored value or default true for dark mode
  //I don't know how to fix this. 
  const toggleLightMode = () => {
    // Toggle light mode
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    // Update local storage
    //For some reason, when this is set to lightMode and not darkmode it breaks. I'm super confused on 
    //Why this specifically will cause breaks between, so I'm leaving it.
    localStorage.setItem("darkMode", newDarkMode);
    // This will also break when changed. I don't know anymore.
    document.body.classList.toggle("dark-mode", newDarkMode);
  };

  useEffect(() => {
    // Set initial dark mode class on body when component mounts
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    // Get token from local storage or fetch it
    async function getToken() {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
      } else {
        const response = await fetch("/auth/token");
        const json = await response.json();
        setToken(json.access_token);
        localStorage.setItem("token", json.access_token);
      }
    }
    getToken();
  }, []);

  return (
    <Router>
      {/* TopBar component */}
      <TopBar token={token} />
      <Routes>
        {/* Routes for different pages */}
        {/* Login page */}
        <Route
          path="/"
          element={
            token === "" || token == null ? (
              <Login />
            ) : (
              <Navigate replace to="/home" />
            )
          }
        />
        {/* Home page */}
        <Route
          path="/home"
          element={
            token === "" || token == null ? (
              <Navigate replace to="/" />
            ) : (
              <Navigate replace to="/top-tracks" />
            )
          }
        />
        {/* Top Tracks page */}
        <Route
          path="/top-tracks"
          element={<TopTracksPage token={token} setToken={setToken} />}
        />
        {/* Top Artists page */}
        <Route
          path="/top-artists"
          element={<TopArtistsPage token={token} setToken={setToken} />}
        />
        {/* Recommendations page */}
        <Route
          path="/playlists"
          element={
            <RecommendationsPage token={token} setToken={setToken} />
          }
        />
        <Route
          path="/moods"
          element={
            <MoodsPage token={token} setToken={setToken} />
          }
        />
        {/* Mode page */}
        <Route
          path="/mode"
          element={<Mode toggleLightMode={toggleLightMode} />} // Pass the toggle function as prop
        />
      </Routes>
    </Router>
    
  );
}

export default App;
