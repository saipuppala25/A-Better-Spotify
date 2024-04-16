// src/pages/TopTracksPage.js

import React from 'react';
import TopArtists from '../component/TopArtists'; // Adjust the import path as necessary

function TopArtistsPage({ token, setToken }) {
  // Style for the container to start content 500px from the top
  const containerStyle = {
      paddingTop: '2450px', // Add 500px padding at the top
      paddingLeft: '20px', // Optional left padding
      paddingRight: '20px', // Optional right padding
      paddingBottom: '20px', // Optional bottom padding
    };

  return (
    <div style={containerStyle}>
      <TopArtists token={token} setToken={setToken} />
    </div>
  );
}

export default TopArtistsPage;
