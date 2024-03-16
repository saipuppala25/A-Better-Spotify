import React, { useState, useEffect } from 'react';
import { fetchWebApi } from "../service/apiService";
import {
    Button,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Tooltip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    ButtonGroup,
    Typography,
    TextField,
  } from '@mui/material'
  import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


function TopTracks({token, setToken}){

    const [tracks, setTracks] = useState([]);
    const [num, setNum] = useState(5);
    const [playlist, setPlaylist] = useState([])
    const [hasPlay, setHasPlay] = useState(false)
    const [alignment, setAlignment] = React.useState('long_term');

    const handleAlignment = (event, newAlignment) => {
      if(newAlignment == null){
        return;
      }
      setAlignment(newAlignment);
    };
    
      
    async function getTopTracks(){
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (await fetchWebApi(
        token, 'v1/me/top/tracks?time_range='+alignment+'&limit='+num, 'GET'
    )).items;
    }

    useEffect(() => {
        getTracks();
      }, []);

    async function getTracks() {
      console.log(token)
      const topTracks = await getTopTracks();
      setTracks(topTracks)
      console.log(topTracks);
      console.log(
        topTracks?.map(
          ({name, artists}) =>
            `${name} by ${artists.map(artist => artist.name).join(', ')}`
        )
      );
      if(hasPlay){
        handleCreatePlaylist()
      }
    }


    async function handleCreatePlaylist() {
      // const tracksUri = tracks.map(track => track.uri);
      let tracksUri = tracks?.map(track =>"spotify:track:"+track.id)
      const { id: user_id } = await fetchWebApi(token, 'v1/me', 'GET')
      //user id is starting to work
      console.log("User ID:", user_id);
      console.log("Token: ", token)


      const playlst = await fetchWebApi(
        token, 
        `v1/users/${user_id}/playlists`, 'POST', {
          "name": "My Top Tracks playlist",
          "description": "Playlist created with A Better Spotify App",
          "public": false
      })
    
      await fetchWebApi(
        token,
        `v1/playlists/${playlst.id}/tracks?uris=${tracksUri.join(',')}`,
        'POST'
      );
      setPlaylist(playlst)
      setHasPlay(true)

    }

      useEffect(() => {
        getTracks();
      }, [num,alignment]);


    return (
        <div style={{padding: '0.8rem',background : "#53bd58" }}>
          <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          align='center'>
            {(tracks!==undefined?"Top "+num+" Tracks":"Get New Token")}
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                style={{background : "#2e7d32"}}
                >
                    <TableCell>Name</TableCell>
                    <TableCell>Artists</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <>
                  {tracks?.map(({name,artists}) =>(
                    <TableRow
                    style={{background : "#74b577"}}
                    >
                      <TableCell>{name}</TableCell>
                      <TableCell>{artists.map(artist => artist.name).join(', ')}</TableCell>
                    </TableRow>
                  ))}
                </>
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{display:"flex",marginTop:"10px"}}>
            <FormControl  variant="outlined" className="form-control">
              <TextField
                sx={{minWidth:"249px"}}
                fullWidth
                focused
                color='primary'
                className="num-input"
                // id="outlined-number"
                label="Number of Songs"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="filled"
                value={num}
                onChange={(e) => setNum(e.target.value)}
              />
              <ToggleButtonGroup
                color="secondary"
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
              >
                <ToggleButton value="long_term" aria-label="left aligned">
                  12 Months
                </ToggleButton>
                <ToggleButton value="medium_term" aria-label="centered">
                  6 Months
                </ToggleButton>
                <ToggleButton value="short_term" aria-label="right aligned">
                  1 Month
                </ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
            <Button
              sx={{marginLeft:"50px"}}
              color='success'
              variant='contained'
              onClick={handleCreatePlaylist}>
              Create Playlist
            </Button>
          </div>
          
          {hasPlay!=[] && (
            <iframe
            title="Spotify Embed: Recommendation Playlist "
            src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0`  }
            width="100%"
            height="100%"
            style={{marginTop:"10px", maxHeight: '360px', marginBottom:"200px" }}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            />
          )}
        </div>
        
        
        
    );
}
export default TopTracks;