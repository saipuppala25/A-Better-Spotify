import React, {useState, useEffect} from 'react';
import './visuals.css';
import TopBar from "./component/TopBar"


import explicitVsNonexplicit from './Visualizations/graphs/explicit_vs_nonexplicit.png';
import listensPerHour from './Visualizations/graphs/listens_per_hour.png';
import topArtistsTotal from './Visualizations/graphs/top_artists_total_listening_time.png';
import topSongsByPlays from './Visualizations/graphs/top_songs_by_plays.png';


function Visuals() {
  // State to store the image URLs fetched from the backend API
  const [imageUrls, setImageUrls] = useState({
    explicitVsNonexplicit: '',
    listensPerHour: '',
    topArtistsTotal: '',
    topSongsByPlays: ''
  });

  // Function to fetch image URLs from the backend API
  const fetchImageUrls = async () => {
    try {
      const response = await fetch('/api/visuals');
      if (!response.ok) {
        throw new Error('Failed to fetch image URLs');
      }
      console.log(response);
      const data = await response.json();
      setImageUrls(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Effect hook to fetch image URLs when the component mounts
  useEffect(() => {
    fetchImageUrls();
  });

  // Function to handle image click and redirect to individual image page
  const handleImageClick = (imageKey) => {
    window.location.href = `/image/${imageKey}`;
    console.log(imageKey);
  };

  // Render the component with images and their respective URLs
  return (
    <div className="visuals-container">
      <TopBar />
      <h2>Stats</h2>
      <div className="grid-container">
        <div className="grid-item" onClick={() => handleImageClick('explicitVsNonexplicit')}>
          <img src={explicitVsNonexplicit} alt="Explicit vs Nonexplicit" />
          <p>Explicit vs Nonexplicit</p>
        </div>
        <div className="grid-item" onClick={() => handleImageClick('listensPerHour')}>
          <img src={listensPerHour} alt="Listens Per Hour" />
          <p>Listens Per Hour</p>
        </div>
        <div className="grid-item" onClick={() => handleImageClick('topArtistsTotal')}>
          <img src={topArtistsTotal} alt="Top Artists Total" />
          <p>Top Artists by Total Listening Time</p>
        </div>
        <div className="grid-item" onClick={() => handleImageClick('topSongsByPlays')}>
          <img src={topSongsByPlays} alt="Top Songs By Plays" />
          <p>Top Songs By Plays</p>
        </div>
      </div>
    </div>
  );
}

export default Visuals;
