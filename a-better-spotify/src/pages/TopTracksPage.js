// src/pages/TopTracksPage.js

import React from "react";
import TopTracks from "../component/TopTracks"; // Adjust the import path as necessary

function TopTracksPage({ token, setToken }) {
  return (
    <div>
      <h2>Top Tracks</h2>
      <TopTracks token={token} setToken={setToken} />
    </div>
  );
}

export default TopTracksPage;
