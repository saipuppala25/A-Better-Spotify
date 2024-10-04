// src/pages/RecommendationsPage.js

import React from "react";
import RecommendedTracks from "../component/RecommendedTracks"; // Adjust the import path as necessary
import CustomMood from "../component/CustomMood";

function MoodsPage({ token, setToken }) {

  const containerStyle = {
    paddingTop: '250px', // Add 500px padding at the top
    paddingLeft: '20px', // Optional left padding
    paddingRight: '20px', // Optional right padding
    paddingBottom: '20px', // Optional bottom padding
  };

  return (
     <div style={containerStyle}>
      <CustomMood token={token} setToken={setToken} />
    </div>
  );
}

export default MoodsPage;
