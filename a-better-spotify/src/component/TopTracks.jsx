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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

function TopTracks({ token, setToken }) {
  const [tracks, setTracks] = useState([]);
  const [num, setNum] = useState(50);
  const [playlist, setPlaylist] = useState([]);
  const [hasPlay, setHasPlay] = useState(false);
  const [alignment, setAlignment] = useState('long_term');

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  async function getTopTracks() {
    return (await fetchWebApi(
      token, 'v1/me/top/tracks?time_range=' + alignment + '&limit=' + num, 'GET'
    )).items;
  }

  async function getTracks() {
    const topTracks = await getTopTracks();
    setTracks(topTracks);
    if (hasPlay) {
      handleCreatePlaylist();
    }
  }

  async function handleCreatePlaylist() {
    let trackUris = tracks?.map(track => "spotify:track:" + track.id);
    const { id: user_id } = await fetchWebApi(token, 'v1/me', 'GET');
    const playlst = await fetchWebApi(
      token,
      `v1/users/${user_id}/playlists`, 'POST', {
        "name": "My Top Tracks playlist",
        "description": "Playlist created with A Better Spotify App",
        "public": false
      });

    await fetchWebApi(
      token,
      `v1/playlists/${playlst.id}/tracks?uris=${trackUris.join(',')}`,
      'POST'
    );
    setPlaylist(playlst);
    setHasPlay(true);
  }

  useEffect(() => {
    getTracks(); // or getTopArtists for the TopArtists component
}, [num, alignment, token]); // Include token in the dependency array


  return (
    <Paper elevation={3} sx={{ background: 'linear-gradient(90deg, #4B5FBE 0%, #BC55D9 100%)', borderRadius: '15px', padding: '20px', color: 'white' }}>
      <Typography variant="h4" align="center" gutterBottom>
        {tracks !== undefined ? `Top ${num} Tracks` : 'Get New Token'}
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
        <Table>
          <TableHead>
            <TableRow >
              <TableCell><Typography variant="h6"><strong>Name</strong></Typography></TableCell>
              <TableCell><Typography variant="h6"><strong>Artists</strong></Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tracks?.map(({ name, artists }) => (
              <TableRow key={name}>
                <TableCell>{name}</TableCell>
                <TableCell>{artists.map(artist => artist.name).join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} display="flex" alignItems="center" justifyContent="center">
       
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
        >
          <ToggleButton value="long_term" sx={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white' }}>12 Months</ToggleButton>
          <ToggleButton value="medium_term" sx={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white' }}>6 Months</ToggleButton>
          <ToggleButton value="short_term" sx={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white' }}>1 Month</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Paper>
  );
}

export default TopTracks;
