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
  Divider,
  Stack,
  Slider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import RecommendedTracks from './RecommendedTracks';



function CustomMood({token, setToken}){

    const [tracks, setTracks] = useState([]);
    const [ids, setIds] = useState([])
    const [recommendations, setRecommendations] = useState([])
    const [playlist, setPlaylist] = useState([])
    const [hasPlay, setHasPlay] = useState(false)
    const [ratelimit, setRatelimit] = useState(false)
    const [num, setNum] = useState(5);
    const [acousticness, setAcousticness] = useState(.5);
    const [danceability, setDanceability] = useState(.5);
    const [energy, setEnergy] = useState(.5);
    const [instrumentalness, setInstrumentalness] = useState(.5);
    const [liveness, setLiveness] = useState(.5);
    const [speechiness, setSpeechiness] = useState(.5);
    const [valence, setValence] = useState(.5);
    const [genre, setGenre] = useState("");
    const [genres, setGenres] = useState([]);
    const [color, setColor] = useState("primary");

    
      
    async function getRecentTracks(){
        // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
        try {
            return (await fetchWebApi(
                token, 'v1/recommendations/available-genre-seeds', 'GET'
            )).genres;
        } catch (error) {
            setRatelimit(true)
        }
        
    }

    async function getRecommendations(){
        if(genre ===""){
            setColor('error')
            return;
        }
        // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
        console.log(["hi"].join(','))
        let total_tracks=[]
        let temp = await fetchWebApi(
        token, `v1/recommendations?limit=` + num + `&seed_genres=${genre}&target_acousticness=${acousticness}&target_danceability=${danceability}&target_energy=${energy}&target_instrumentalness=${instrumentalness}&target_liveness=${liveness}&target_speechiness=${speechiness}&target_valence${valence}`, `GET`
        )
        console.log(temp)
        total_tracks = total_tracks.concat(temp.tracks)
        

        setRecommendations(total_tracks)

        return total_tracks;
      }
    

    async function getTracks() {
      console.log(token)
      let temp = await getRecentTracks();
      console.log(temp)
      setGenres(temp)
      
      
    }

    async function createPlaylist(type){
      let tracksUri = []
      if(type == "rec"){
        let rec = recommendations;
        if(recommendations.length == 0){
            try{
                rec = await getRecommendations();
                console.log(rec)
              }catch{
                setRatelimit(true)
                return;
              }
        }
        
        
        tracksUri = rec?.map(track =>"spotify:track:"+track.id)
      }
      else{
        return
      }
      console.log(tracksUri)
      const { id: user_id } = await fetchWebApi(token, 'v1/me', 'GET')
    
      const playlst = await fetchWebApi(
        token, 
        `v1/users/${user_id}/playlists`, 'POST', {
          "name": "My recommendation playlist",
          "description": "Playlist created with A Better Spotify App",
          "public": false
      })
    
      await fetchWebApi(
        token,
        `v1/playlists/${playlst.id}/tracks?uris=${tracksUri.join(',')}`,
        'POST'
      );
      setPlaylist(playlst)
      console.log(playlst)
      setHasPlay(true)
      return playlst;
    }

    useEffect(() => {
        getTracks();
    }, [num]);
    useEffect(() => {
        getTracks();
    }, []);
    const handleChangeAcousticness = (event, newValue) => {
        setAcousticness(newValue);
    };
    const handleChangeDanceability = (event, newValue) => {
        setDanceability(newValue);
    };
    const handleChangeEnergy= (event, newValue) => {
        setEnergy(newValue);
    };
    const handleChangeInstrumentalness = (event, newValue) => {
        setInstrumentalness(newValue);
    };
    const handleChangeLiveness = (event, newValue) => {
        setLiveness(newValue);
    };
    const handleChangeSpeechiness = (event, newValue) => {
        setSpeechiness(newValue);
    };
    const handleChangeValence = (event, newValue) => {
        setValence(newValue);
    };
    const handleChange = (e) => {
        setGenre( e.target.value )
      }
    const marks =[{value: 0,label: '0',},{value: 1,label: '1'}]


    return (
        <div style={{padding: '0.8rem',background : "#53bd58",paddingBottom:"200px" }}>
            <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            align='center'>
                {(!ratelimit?"Custom Mood":"Custom Mood (API Rate Limited Please Wait)")}
            </Typography>
            <FormControl focused fullWidth margin="dense" color={color}>
            <InputLabel id="crn-label">Genres</InputLabel>
            <Select
                
                label="Genre"
                labelId="crn-label"
                name="crn"
                color={color}
                value={genre}
                onChange={handleChange}>
                {genres?.map((gen,index) =>(
                    <MenuItem key={index} value={gen}>
                        {gen}
                    </MenuItem>
                ))}
                </Select>
                {/* {courseNumbers.map((crn, index) => (
                <MenuItem key={index + 1} value={crn}>
                    {crn}
                </MenuItem>
                ))} */}
            </FormControl>
            <Stack sx={{ height: 300,marginBottom:"40px" }} spacing={1} direction="row">
                <div>
                    <Typography>Acousticness</Typography>
                    <Slider
                    style={{marginLeft:"35px",marginTop:"7px"}}
                        aria-label="acousticness"
                        orientation="vertical"
                        valueLabelDisplay="auto"
                        defaultValue={0}
                        value={acousticness}
                        onChange={handleChangeAcousticness}
                        step={.01}
                        min={0}
                        max={1}
                    />
                </div>
                <Divider orientation="vertical" variant="middle"  sx={{}}></Divider>
                <div>
                    <Typography>Danceability</Typography>
                    <Slider
                        style={{marginLeft:"30px",marginTop:"7px"}}
                        aria-label="acousticness"
                        orientation="vertical"
                        valueLabelDisplay="auto"
                        defaultValue={0}
                        value={danceability}
                        onChange={handleChangeDanceability}
                        step={.01}
                        min={0}
                        max={1}
                    />
                </div>
                <div>
                    <Typography>Energy</Typography>
                    <Slider
                        style={{marginLeft:"10px",marginTop:"7px"}}
                        aria-label="energy"
                        orientation="vertical"
                        valueLabelDisplay="auto"
                        defaultValue={0}
                        value={energy}
                        onChange={handleChangeEnergy}
                        step={.01}
                        min={0}
                        max={1}
                    />
                </div>
                <div>
                    <Typography>Instrumentalness</Typography>
                    <Slider
                        style={{marginLeft:"52px",marginTop:"7px"}}
                        aria-label="Instrumentalness"
                        orientation="vertical"
                        valueLabelDisplay="auto"
                        defaultValue={0}
                        value={instrumentalness}
                        onChange={handleChangeInstrumentalness}
                        step={.01}
                        min={0}
                        max={1}
                    />
                </div>
                <div>
                    <Typography>Liveness</Typography>
                    <Slider
                        style={{marginLeft:"20px",marginTop:"7px"}}
                        aria-label="liveness"
                        orientation="vertical"
                        valueLabelDisplay="auto"
                        defaultValue={0}
                        value={liveness}
                        onChange={handleChangeLiveness}
                        step={.01}
                        min={0}
                        max={1}
                    />
                </div>
                <div>
                    <Typography>Speechiness</Typography>
                    <Slider
                        style={{marginLeft:"35px",marginTop:"7px"}}
                        aria-label="speechiness"
                        orientation="vertical"
                        valueLabelDisplay="auto"
                        defaultValue={0}
                        value={speechiness}
                        onChange={handleChangeSpeechiness}
                        step={.01}
                        min={0}
                        max={1}
                    />
                </div>
                <div>
                    <Typography>Valence</Typography>
                    <Slider
                        style={{marginLeft:"20px",marginTop:"7px"}}
                        aria-label="valence"
                        orientation="vertical"
                        valueLabelDisplay="auto"
                        defaultValue={0}
                        value={valence}
                        onChange={handleChangeValence}
                        step={.01}
                        min={0}
                        max={1}
                        marks={marks}
                    />
                </div>
            </Stack>
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
                            {recommendations?.map(({name,artists}) =>(
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
            <div style={{display:"flex",justifyContent:'center'}}>
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
                <Button
                    sx={{minHeight:"55px"}}
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={(e) => {
                        getRecommendations()
                    }}
                    >
                    Get Recomendations
                </Button>
            </div>
            
            <div style={{display:"flex",justifyContent:"center"}}>
                <Typography id="modal-modal-title"
                style={{marginRight: "10px"}}
                variant="h6"
                component="h2"
                align='center'>Create </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={(e) => {
                    createPlaylist("rec")
                    }}
                >
                    Recomendations Playlist
                </Button>
              
            </div>
            
            {hasPlay!=[] && (
              <iframe
              title="Spotify Embed: Recommendation Playlist "
              src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0`  }
              width="100%"
              height="100%"
              style={{marginTop:"10px", maxHeight: '360px', marginBottom:"10px" }}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              />
            )}
        </div>
        
        
    );
}
export default CustomMood;