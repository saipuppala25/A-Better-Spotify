// src/pages/RecommendationsPage.js

import React from 'react';
import RecommendedTracks from '../component/RecommendedTracks'; // Adjust the import path as necessary
import NewPlaylist from '../component/NewPlaylist';

function RecommendationsPage({ token, setToken }) {
  return (
    <div>
      <h2>Recommendations</h2>
      {/* <RecommendedTracks token={token} setToken={setToken} /> */}
      <NewPlaylist token={token} setToken={setToken} />
    </div>
  );
}

export default RecommendationsPage;
