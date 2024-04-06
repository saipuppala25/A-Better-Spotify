import React, { useState, useEffect } from 'react';
import { fetchWebApi } from "../service/apiService";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

function CustomMood({ token }) {
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [attributes, setAttributes] = useState({
    acousticness: 0.5,
    danceability: 0.5,
    energy: 0.5,
    instrumentalness: 0.5,
    liveness: 0.5,
    speechiness: 0.5,
    valence: 0.5,
  });

  async function getGenres() {
    try {
      const genresData = await fetchWebApi(token, 'v1/recommendations/available-genre-seeds', 'GET');
      setGenres(genresData.genres);
    } catch (error) {
      console.error('Failed to fetch genres:', error);
    }
  }

  async function getRecommendations() {
    if (genre==="") return; // Ensure a genre is selected
    try {
      let queryParams = `limit=10&seed_genres=${genre}`; // Example limit, adjust as needed
      Object.entries(attributes).forEach(([key, value]) => {
        queryParams += `&target_${key}=${value}`;
      });
      const recommendationsData = await fetchWebApi(
        token, `v1/recommendations?${queryParams}`, 'GET'
      );
      setRecommendations(recommendationsData.tracks);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    }
  }

  useEffect(() => {
    if(token!=""){
      getGenres();
    }
  }, [token]);

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };

  const handleChangeAttributes = (name) => (event, newValue) => {
    setAttributes({ ...attributes, [name]: newValue });
  };

  return (
    <Paper elevation={3} sx={{ 
        background: 'linear-gradient(90deg, #4B5FBE 0%, #BC55D9 100%)', 
        borderRadius: '15px', 
        padding: '20px', 
        color: 'white',
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2, 
        minWidth: 120, 
        maxWidth: 500 
    }}>
      <FormControl fullWidth size="small" variant="filled" sx={{ marginBottom: 2 }}>
        <InputLabel id="genre-select-label">Genre</InputLabel>
        <Select
          labelId="genre-select-label"
          value={genre}
          onChange={handleGenreChange}
          sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
        >
          {genres.map((gen, index) => (
            <MenuItem key={index} value={gen}>{gen}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>
        {Object.entries(attributes).map(([key, value]) => (
          <Box key={key} sx={{ width: 'calc(50% - 8px)' }}>
            <Typography id={`${key}-slider`} gutterBottom variant="caption">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Typography>
            <Slider
              size="small"
              value={value}
              onChange={handleChangeAttributes(key)}
              aria-labelledby={`${key}-slider`}
              valueLabelDisplay="auto"
              step={0.01}
              marks
              min={0}
              max={1}
              sx={{ color: '#dee2e6' }} // Adjusting slider thumb color for better visibility
            />
          </Box>
        ))}
      </Box>
      <Button variant="contained" onClick={getRecommendations} sx={{ alignSelf: 'center', marginTop: 2 }}>
        Get Recommendations
      </Button>
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
    </Paper>
  );
}

export default CustomMood;
