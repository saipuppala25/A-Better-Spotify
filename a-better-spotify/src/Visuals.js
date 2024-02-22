import React from 'react';
import './visuals.css';


import explicitVsNonexplicit from './Visualizations/graphs/explicit_vs_nonexplicit.png';
import listensPerHour from './Visualizations/graphs/listens_per_hour.png';
import topArtistsTotal from './Visualizations/graphs/top_artists_total_listening_time.png';
import topSongsByPlays from './Visualizations/graphs/top_songs_by_plays.png';


function Visuals() {
  return (
    <div className="visuals-container">
      <h2>Stats</h2>
      <div className="grid-container">
        <div className="grid-item">
          <img src={explicitVsNonexplicit} alt="Explicit vs Nonexplicit" />
          <p>Explicit vs Nonexplicit</p>
        </div>
        <div className="grid-item">
          <img src={listensPerHour} alt="Listens Per Hour" />
          <p>Listens Per Hour</p>
        </div>
        <div className="grid-item">
          <img src={topArtistsTotal} alt="Top Artists Total" />
          <p>Top Artists by Total Listening Time</p>
        </div>
        <div className="grid-item">
          <img src={topSongsByPlays} alt="Top Songs By Plays" />
          <p>Top Songs By Plays</p>
        </div>
      </div>
    </div>
  );
}

export default Visuals;
