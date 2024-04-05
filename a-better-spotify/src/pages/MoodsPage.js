// src/pages/RecommendationsPage.js

import React from "react";
import RecommendedTracks from "../component/RecommendedTracks"; // Adjust the import path as necessary
import CustomMood from "../component/CustomMood";

function MoodsPage({ token, setToken }) {
  return (
    <div>
      <h2>Moods</h2>
      {/* <RecommendedTracks token={token} setToken={setToken} /> */}
      <CustomMood token={token} setToken={setToken} />
    </div>
  );
}

export default MoodsPage;
