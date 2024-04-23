import React from 'react';
import TopBar from '../component/TopBar';
import NewPlaylist from '../component/NewPlaylist';
import CustomMood from '../component/CustomMood';
import TopTracks from '../component/TopTracks';
import RecommendedTracks from '../component/RecommendedTracks';
import TopArtists from '../component/TopArtists';

function Home({ token, setToken }) {
    // Adjusted style for the main container to improve alignment and spacing
    const mainContainerStyle = {
      paddingTop: '100px', // Reduced top padding to better align with the TopBar
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
    };
  
    // Revised style for the flex items to position them lower on the screen and improve alignment
    const flexItemStyle = {
      maxWidth: 'calc(50% - 10px)',
      flexBasis: 'calc(50% - 10px)',
      boxSizing: 'border-box',
      marginTop: '500px',  // Added top margin to lower the items on the screen
    };
  
    return (
      <>
        <TopBar />
        <div style={mainContainerStyle}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            <div style={flexItemStyle}>
              <TopArtists token={token} setToken={setToken} />
            </div>
            {/* Uncomment other components as needed */}
            {/* <div style={flexItemStyle}>
              <TopTracks token={token} setToken={setToken} />
            </div>
            <div style={flexItemStyle}>
              <NewPlaylist token={token} setToken={setToken} />
            </div>
            <div style={flexItemStyle}>
              <CustomMood token={token} setToken={setToken} />
            </div> */}
          </div>
        </div>
      </>
    );
}

export default Home;
