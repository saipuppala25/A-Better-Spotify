// src/pages/TopTracksPage.js

import React from 'react';
import TopArtists from '../component/TopArtists'; // Adjust the import path as necessary

function TopArtistsPage({ token, setToken }) {
  return (
    <div>
      <h2>Top Artists</h2>
      <TopArtists token={token} setToken={setToken} />
    </div>
  );
}

export default TopArtistsPage;
