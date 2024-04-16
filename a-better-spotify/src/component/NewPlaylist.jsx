import React, { useState } from 'react';
import {
  Paper, Typography, TableContainer, Table, TableHead, TableBody,
  TableRow, TableCell, Box, TextField, FormControl, InputLabel,
  MenuItem, Select, Button, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { fetchWebApi } from "../service/apiService";

function NewPlaylist({ token, setToken }) {
  const [recommendations, setRecommendations] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [hasPlay, setHasPlay] = useState(false);
  const [num, setNum] = useState(30);
  const [type, setType] = useState("");


  // Fetch recommendations based on the selected type
  async function getRecs() {
    let tracks, ids, recs;
    try {
        if (type === "Top Tracks") {
            tracks = (await fetchWebApi(
                token, 'v1/me/top/tracks?time_range=long_term&limit=' + num, 'GET'
            )).items;
        } else if (type === "Recently Played") {
            tracks = (await fetchWebApi(
                token, 'v1/me/player/recently-played?limit=' + num, 'GET' // Increase limit for recently played tracks
            )).items.map(item => item.track);
        }

        ids = tracks.map(track => track.id);
        recs = await getRecommendations(num, ids);
        setRecommendations(recs);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
}

  async function getRecommendations(num, ids) {
    // Split the array of track IDs into batches of 5
    const batches = [];
    for (let i = 0; i < ids.length; i += 5) {
        batches.push(ids.slice(i, i + 5));
    }

    try {
        // Initialize an array to store recommendations from all batches
        const allRecommendations = [];

        // Send requests for each batch of seed tracks
        for (const batch of batches) {
            const seedTracksParam = batch.join(',');
            const response = await fetchWebApi(
                token,
                `v1/recommendations?limit=${num}&seed_tracks=${seedTracksParam}`,
                'GET'
            );
            const recommendations = response.tracks;
            
            // Merge recommendations from the current batch with previous batches
            allRecommendations.push(...recommendations);
            
            // If the total number of recommendations meets or exceeds the requested limit, break the loop
            if (allRecommendations.length >= num) {
                break;
            }
        }

        // Return the merged recommendations
        return allRecommendations;
    } catch (error) {
        console.error('Error fetching recommended tracks:', error);
        return []; // Return an empty array in case of error
    }
}

  // Create a new playlist on Spotify
  async function createPlaylist() {
    if (!recommendations.length) return;

    const { id: user_id } = await fetchWebApi(token, 'v1/me', 'GET');
    const playlistResponse = await fetchWebApi(
      token, `v1/users/${user_id}/playlists`, 'POST', {
        name: "My New Playlist",
        description: "A playlist created from recommendations.",
        public: false
      });

    const tracksUri = recommendations.map(track => `spotify:track:${track.id}`);
    await fetchWebApi(
      token,
      `v1/playlists/${playlistResponse.id}/tracks`, 'POST', { uris: tracksUri });

    setPlaylist(playlistResponse);
    setHasPlay(true);
  }

  const cellStyle = {
    background: 'linear-gradient(to right, #6E48AA, #9D50BB)', // Purple gradient background
    color: 'white'
  };


  return (
    <Paper elevation={3} sx={{ background: 'linear-gradient(to right, #4B5FBE 0%, #BC55D9 100%)', borderRadius: '15px', padding: '20px', color: '#fff', marginBottom: '20px', overflow: 'hidden' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Create New Playlist
      </Typography>
      
      <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent', maxHeight: 440, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={cellStyle}><Typography variant="h6" fontWeight="medium">Name</Typography></TableCell>
              <TableCell style={cellStyle}><Typography variant="h6" fontWeight="medium">Artists</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recommendations.map((track, index) => (
              <TableRow key={index}>
                <TableCell style={cellStyle}>{track.name}</TableCell>
                <TableCell style={cellStyle}>{track.artists.map(artist => artist.name).join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box mt={2} display="flex" justifyContent="center" gap={2}>
        <TextField
          label="Number of Tracks"
          type="number"
          variant="outlined"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
        />
        <FormControl variant="filled" fullWidth size="small" sx={{ '.MuiFilledInput-root': { bgcolor: 'rgba(255, 255, 255, 0.09)', color: 'white' } }}>
          <InputLabel id="type-select-label" sx={{ color: 'white' }}>Recommend From</InputLabel>
          <Select
            labelId="type-select-label"
            value={type}
            onChange={(e) => setType(e.target.value)}
            sx={{ '.MuiSelect-select': { bgcolor: 'transparent', color: 'white', borderColor: 'white' } }}
          >
            <MenuItem value="Top Tracks">Top Tracks</MenuItem>
            <MenuItem value="Recently Played">Recently Played</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Fetch recommended songs based on selection" arrow>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={getRecs}
            sx={{
              background: 'linear-gradient(to right, #6E48AA, #9D50BB)', 
              color: 'white',
              '&:hover': { background: 'linear-gradient(to right, #5C37A3, #8A44AC)' }
            }}
          >
            Fetch Songs
          </Button>
        </Tooltip>
        <Tooltip title="Create a new playlist with fetched songs" arrow>
          <Button
            variant="contained"
            startIcon={<PlaylistAddCheckIcon />}
            onClick={createPlaylist}
            sx={{
              background: 'linear-gradient(to right, #6E48AA, #9D50BB)', 
              color: 'white',
              '&:hover': { background: 'linear-gradient(to right, #5C37A3, #8A44AC)' }
            }}
          >
            Create Playlist
          </Button>
        </Tooltip>
      </Box>
      
      {hasPlay && playlist && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <iframe
            title="Spotify Embed: New Playlist"
            src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator`}
            width="100%"
            height="380"
            frameBorder="0"
            allowTransparency="true"
            allow="encrypted-media"
            style={{ borderRadius: '12px' }}
          ></iframe>
        </Box>
      )}
    </Paper>
  );
}

export default NewPlaylist;