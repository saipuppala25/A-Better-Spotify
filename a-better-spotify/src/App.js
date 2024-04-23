// App.js

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Home from "./pages/Home";
import TopTracksPage from "./pages/TopTracksPage"; // Import the new page component
import TopBar from "./component/TopBar";
import TopArtistsPage from "./pages/TopArtistsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import MoodsPage from "./pages/MoodsPage";
import "./App.css";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    async function getToken() {
      const response = await fetch("/auth/token");
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();
  }, []);

  return (
    <Router>
      <TopBar token={token} />
      <Routes>
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
        <Route
          path="/home"
          element={
            token === "" || token == null ? (
              <Navigate replace to="/" />
            ) : (
              <Navigate replace to="/top-tracks" /> // Redirect to Top Tracks page
            )
          }
        />
        <Route
          path="/top-tracks"
          element={<TopTracksPage token={token} setToken={setToken} />}
        />
        <Route
          path="/top-artists"
          element={<TopArtistsPage token={token} setToken={setToken} />}
        />
        <Route
          path="/playlists"
          element={<RecommendationsPage token={token} setToken={setToken} />}
        />
        <Route
          path="/moods"
          element={<MoodsPage token={token} setToken={setToken} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
