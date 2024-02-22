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


function TopTracks({token}){

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
        </div>
        
        
    );
}
export default TopTracks;