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


function TopArtists({token, setToken}){

    const [artists, setArtists] = useState([]);
    const [num, setNum] = useState(5);
    const [alignment, setAlignment] = React.useState('long_term');

    const handleAlignment = (event, newAlignment) => {
      if(newAlignment == null){
        return;
      }
      setAlignment(newAlignment);
    };
    
      
    async function getTopArtists(){
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (await fetchWebApi(
        token, 'v1/me/top/artists?time_range='+alignment+'&limit='+num, 'GET'
    )).items;
    }

    useEffect(() => {
        getArtists();
      }, []);

    async function getArtists() {
      const topArtists = await getTopArtists();
      setArtists(topArtists)
      console.log(topArtists);
      console.log(
        topArtists?.map(
          ({name}) =>
            `${name}`
        )
      );
    }


    useEffect(() => {
      getArtists();
    }, [num,alignment]);

    return (
        <div style={{padding: '0.8rem',background : "#53bd58" }}>
          <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          align='center'>
            {(artists!==undefined?"Top "+num+" Artists":"Get New Token")}
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                style={{background : "#2e7d32"}}
                >
                    <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <>
                  {artists?.map(({name}) =>(
                    <TableRow
                    style={{background : "#74b577"}}
                    >
                      <TableCell>{name}</TableCell>
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
                label="Number of Artists"
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
          </div>
        </div>
    );
}

export default TopArtists;
