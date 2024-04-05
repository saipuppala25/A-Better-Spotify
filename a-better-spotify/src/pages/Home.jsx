import React from 'react';
import TopBar from '../component/TopBar';
import NewPlaylist from '../component/NewPlaylist';
import CustomMood from '../component/CustomMood';
import TopTracks from '../component/TopTracks';
import RecommendedTracks from '../component/RecommendedTracks';
import TopArtists from '../component/TopArtists';
import WebPlayback from '../component/WebPlayback';

function Home({ token, setToken }) {
    // Style for the main container to add padding at the top
    // Adjusted paddingTop to a smaller value that should be enough to account for the TopBar height
    const mainContainerStyle = {
      paddingTop: '500px', // Adjusted padding at the top
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
    };
  
    // Adjusted style for the flex items to ensure they are properly aligned and have some space between them
    const flexItemStyle = {
      maxWidth: 'calc(50% - 10px)',
      flexBasis: 'calc(50% - 10px)',
      boxSizing: 'border-box',
    };
  
    return (
      <>
        <TopBar />
        <div style={mainContainerStyle}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {/* <div style={flexItemStyle}>
              <TopTracks token={token} setToken={setToken} />
            </div> */}
            <div style={flexItemStyle}>
              <TopArtists token={token} setToken={setToken} />
            </div>
            {/* <div style={flexItemStyle}>
              <NewPlaylist token={token} setToken={setToken} />
            </div> */}
            {/* <div style={flexItemStyle}>
              <CustomMood token={token} setToken={setToken} />
            </div> */}
          </div>
          <WebPlayback token={token} setToken={setToken} />
        </div>
      </>
    );
}

export default Home;
