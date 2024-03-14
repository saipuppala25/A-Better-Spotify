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


function RecommendedTracks({token, setToken}){

    const [tracks, setTracks] = useState([]);
    const [num, setNum] = useState(5);
    //This part isn't working since the top are pre set I think.
    const topTracksIds = [
        '4daEMLSZCgZ2Mt7gNm2SRa','0CO9NL5n0ghKfuUFE6Mbe9','38gZVjeaeR3gcnCzziAxBm','6wXPV6dNRAhFavrRaCdMXT','0KcP7Aq84oxeGe6xq1Sz93'
      ];

    async function getRecommendations(num) {
        try {
            const seedTracksParam = topTracksIds.slice(0, num).join(',');
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
    
       
    
    useEffect(() => {
        getTracks();
      }, []);

    async function getTracks() {
      console.log(token)
      const recommendedTracks = await getRecommendations(num); // Pass the num parameter to getRecommendations
      setTracks(recommendedTracks)
      console.log(recommendedTracks);
      console.log(
        recommendedTracks?.map(
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
                {(tracks!==undefined?"Recommended "+num+" Tracks":"Recommended Tracks")}
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
export default RecommendedTracks;
