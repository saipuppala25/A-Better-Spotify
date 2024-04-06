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
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // For the "Create Playlist" button

function NewPlaylist({ token, setToken }) {
  const [recommendations, setRecommendations] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [hasPlay, setHasPlay] = useState(false);
  const [num, setNum] = useState(5);
  const [type, setType] = useState("");

  // Keep your existing logic here for fetching recommendations and creating playlists
  async function getRecommendations(num,ids) {
    try {
        const seedTracksParam = ids.slice(0, num).join(',');
        // Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/get-recommendations
        const response = await fetchWebApi(
            token,
            `v1/recommendations?limit=${num}&seed_tracks=${seedTracksParam}`,
            'GET'
        );
        return response.tracks;
    } catch (error) {
        console.error('Error fetching recommended tracks:', error);
        return []; // Return an empty array in case of error
    }
  }

  async function getRecs(){
    let tracks
    let recs
    if(type === "Top Tracks"){
      tracks = (await fetchWebApi(
        token, 'v1/me/top/tracks?time_range=long_term&limit=' + num, 'GET'
      )).items;
      let ids = tracks?.map(track => track.id)
      recs = await getRecommendations(num,ids)
      setRecommendations(recs)
    }else  if(type === "Recently Played"){
      tracks = (await fetchWebApi(
        token, 'v1/me/player/recently-played?limit=5', 'GET'
      )).items;
      let ids = tracks?.map(track => track.track.id)
      recs = await getRecommendations(num,ids)
      setRecommendations(recs)
    } else if(type === "Mood"){

    }else{
      return;
    }
  }



  async function createPlaylist() {
    if(recommendations.length==0){
      return;
    }
    
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
                <TableCell>{track.artists.map((artist)=> artist.name).join(", ")}</TableCell>
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
        <FormControl fullWidth size="small" variant="filled" sx={{ marginBottom: 2 }}>
        <InputLabel id="genre-select-label">Reccomend From</InputLabel>
        <Select
          labelId="genre-select-label"
          value={type}
          onChange={(e)=>setType(e.target.value)}
          sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
        >
          
          <MenuItem key={0} value={"Top Tracks"}>Top Tracks</MenuItem>
          <MenuItem key={0} value={"Recently Played"}>Recently Played</MenuItem>
          {/* <MenuItem key={0} value={"Mood"}>Mood</MenuItem> */}
          
        </Select>
      </FormControl>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={getRecs}
          sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1DB95499' } }} // Spotify green color
        >
          Get Songs
        </Button>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={createPlaylist}
          sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1DB95499' }}} // Spotify green color
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