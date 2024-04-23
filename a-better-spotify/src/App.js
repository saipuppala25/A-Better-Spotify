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
        {/* New routes */}
        {[...Array(20)].map((_, index) => (
          <Route
            key={index}
            path={`/button${index + 1}`}
            element={<LargeObnoxiousButton index={index + 1} />}
          />
        ))}
        {/* End of new routes */}
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

// Large and obnoxious button component
const LargeObnoxiousButton = ({ index }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          padding: "20px 50px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Button {index}
      </button>
    </div>
  );
};

export default App;
