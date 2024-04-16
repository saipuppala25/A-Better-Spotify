import React from "react";
import TopTracks from "../component/TopTracks"; // Adjust the import path as necessary

function TopTracksPage({ token, setToken }) {
  // Style for the container to start content 500px from the top
  const containerStyle = {
    paddingTop: '2250px', // Add 500px padding at the top
    paddingLeft: '20px', // Optional left padding
    paddingRight: '20px', // Optional right padding
    paddingBottom: '20px', // Optional bottom padding
  };

  return (
    <div style={containerStyle}>
      <TopTracks token={token} setToken={setToken} />
    </div>
  );
}

export default TopTracksPage;
