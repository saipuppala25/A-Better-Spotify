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
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';



function NewPlaylist({token, setToken}){

    const [tracks, setTracks] = useState([]);
    const [ids, setIds] = useState([])
    const [recommendations, setRecommendations] = useState([])
    const [subset, setSubset] = useState([])
    const [playlist, setPlaylist] = useState([])
    const [hasPlay, setHasPlay] = useState(false)
    const [ratelimit, setRatelimit] = useState(false)
    const [num, setNum] = useState(5);

    
      
    async function getRecentTracks(){
        // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
        return (await fetchWebApi(
            token, 'v1/me/player/recently-played', 'GET'
        )).items;
    }

    async function getRecommendations(){
        // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
        console.log(["hi"].join(','))
        let total_tracks=[]
        console.log(Math.floor(num/Math.floor(ids.length/5))+1)
        for(let i = 0; i<Math.floor(ids.length/5);i++){
          console.log(ids.slice(i*5,(i+1)*5).join(','))
          let temp = await fetchWebApi(
            token, `v1/recommendations?limit=` + (Math.floor(num/Math.floor(ids.length/5))+1) + `&seed_tracks=${ids.slice(i*5,(i+1)*5).join(',')}`, `GET`
          )
          console.log(temp)
          total_tracks = total_tracks.concat(temp.tracks)
          console.log(total_tracks)
        }
        if(ids.length%5===0){
          setRecommendations(total_tracks)
          let shuffled = [...total_tracks].sort(() => 0.5 - Math.random());
          let subset_temp = shuffled.slice(0, num)
          setSubset(subset_temp)
          return total_tracks;
        }
        console.log(ids.slice(Math.floor(ids.length/5)*5,(Math.floor(ids.length/5)*5)+(ids.length%5)))
        total_tracks.concat((await fetchWebApi(
          token, `v1/recommendations?limit=` + (Math.floor(num/Math.floor(ids.length/5))+1) + `&seed_tracks=${ids.slice(Math.floor(ids.length/5)*5,(Math.floor(ids.length/5)*5)+(ids.length%5)).join(',')}`, `GET`
        )).tracks)

        setRecommendations(total_tracks)
        let shuffled = [...total_tracks].sort(() => 0.5 - Math.random());
        let subset_temp = shuffled.slice(0, num)
        setSubset(subset_temp)

        return total_tracks;
      }
    

    async function getTracks() {
      console.log(token)
      const topTracks = await getRecentTracks();
      console.log(topTracks)
      setTracks(topTracks)
      setIds(topTracks?.map(track => track.track.id))
      console.log(topTracks?.map(track => track.track.id))
      console.log(topTracks);
      await getRecommendations()
      
      
    }

    async function createPlaylist(type){
      let tracksUri = []
      if(type == "top"){
        tracksUri = tracks?.map(track =>"spotify:track:"+track.track.id)
      }
      else{
        let rec = null;
        try{
          rec = await getRecommendations();
          console.log(rec)
        }catch{
          setRatelimit(true)
          return;
        }
        
        tracksUri = subset?.map(track =>"spotify:track:"+track.id)
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


    return (
        <div style={{padding: '0.8rem',background : "#53bd58",paddingBottom:"200px" }}>
            <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            align='center'>
                {(!ratelimit?"Recommendation":"Recommendation (API Rate Limited Please Wait)")}
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
                            {subset?.map(({name,artists}) =>(
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
            <div style={{}}>
              <Typography id="modal-modal-title"
              style={{marginRight: "10px"}}
              variant="h6"
              component="h2"
              align='center'>Create Playlist of </Typography>
              <ButtonGroup disableElevation variant="outlined" aria-label="Basic button group">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={(e) => {
                    createPlaylist("top")
                  }}
                >
                  Recently Played
                </Button>
                <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 2, bgcolor:"Green" }}></Divider>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={(e) => {
                    createPlaylist("rec")
                  }}
                >
                  Recomendations
                </Button>
              </ButtonGroup>
              
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
export default NewPlaylist;