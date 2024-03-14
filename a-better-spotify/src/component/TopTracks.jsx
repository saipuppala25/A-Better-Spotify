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


function TopTracks({token, setToken}){

    const [tracks, setTracks] = useState([]);
    const [num, setNum] = useState(5);

    
      
    async function getTopTracks(){
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (await fetchWebApi(
        token, 'v1/me/top/tracks?time_range=long_term&limit='+num, 'GET'
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
    }


    async function handleCreatePlaylist() {
      // const tracksUri = tracks.map(track => track.uri);
      const { id: user_id } = await fetchWebApi(token, 'v1/me', 'GET')
      //user id is starting to work
      console.log("User ID:", user_id);
      console.log("Token: ", token)
      //This is word for word what they have on the example, so I don't know what's wrong.
      //403	Forbidden - The server understood the request, but is refusing to fulfill it.
      // const playlist = await fetchWebApi(
      //    token,
      //   `v1/users/${user_id}/playlists`, 'POST', {
      //     "name": "My recommendation playlist",
      //     "description": "Playlist created by the tutorial on developer.spotify.com",
      //     "public": false
      // })

    }

      useEffect(() => {
        getTracks();
      }, [num]);


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
            <Typography variant="body1" fontWeight={"light"} gutterBottom></Typography>
            <FormControl variant="outlined" className="form-control">
              <TextField
                focused
                color='primary'
                className="num-input"
                // id="outlined-number"
                label="Number"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="filled"
                value={num}
                onChange={(e) => setNum(e.target.value)}
              />
            </FormControl>
            <Button onClick={handleCreatePlaylist}>Create Playlist</Button>
        </div>
        
        
    );
}
export default TopTracks;