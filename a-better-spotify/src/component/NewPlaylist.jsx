import React, { useState, useEffect } from 'react';
import { fetchWebApi } from "../service/apiService";
import {
  Button,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  TextField,
  FormControl,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // For the "Create Playlist" button

function NewPlaylist({ token, setToken }) {
  const [recommendations, setRecommendations] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [hasPlay, setHasPlay] = useState(false);
  const [num, setNum] = useState(5);

  // Keep your existing logic here for fetching recommendations and creating playlists

  async function createPlaylist() {
    let tracksUri = recommendations.map(track => `spotify:track:${track.id}`);
    
    const { id: user_id } = await fetchWebApi(token, 'v1/me', 'GET');
    const playlistResponse = await fetchWebApi(
      token,
      `v1/users/${user_id}/playlists`, 'POST', {
        "name": "My New Playlist",
        "description": "A playlist created from recommendations.",
        "public": false
      });

    await fetchWebApi(
      token,
      `v1/playlists/${playlistResponse.id}/tracks`, 'POST', {
        "uris": tracksUri
      });

    setPlaylist(playlistResponse);
    setHasPlay(true);
  }

  return (
    <Paper elevation={3} sx={{
      background: 'linear-gradient(90deg, #4B5FBE 0%, #BC55D9 100%)', 
      borderRadius: '15px', 
      padding: '20px', 
      color: 'white', 
      marginBottom: '20px'
    }}>
      <Typography variant="h4" align="center" gutterBottom>
        New Playlist
      </Typography>
      
      <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent', maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="h6"><strong>Name</strong></Typography></TableCell>
              <TableCell><Typography variant="h6"><strong>Artists</strong></Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recommendations.map((track, index) => (
              <TableRow key={index}>
                <TableCell>{track.name}</TableCell>
                <TableCell>{track.artists.join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box mt={2} display="flex" justifyContent="center">
        <TextField
          label="Number of Tracks"
          type="number"
          variant="outlined"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          sx={{ marginRight: '20px' }}
        />
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={createPlaylist}
          sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1DB95499' } }} // Spotify green color
        >
          Create Playlist
        </Button>
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