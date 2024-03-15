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
import AddIcon from '@mui/icons-material/Add';
function TopTracks({token, setToken}){

    const [tracks, setTracks] = useState([]);
    const [ids, setIds] = useState([])
    const [recommendations, setRecommendations] = useState([])
    const [playlist, setPlaylist] = useState([])
    const [hasPlay, setHasPlay] = useState(false)
    const [num, setNum] = useState(5);

    
      
    async function getRecentTracks(){
        // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
        return (await fetchWebApi(
            token, 'v1/me/player/recently-played', 'GET'
        )).items;
    }

    async function getRecommendations(){
        // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
        return (await fetchWebApi(
          token, `v1/recommendations?limit=` + num + `&seed_tracks=${ids.join(',')}`, `GET`
        )).tracks;
      }
    
    useEffect(() => {
        getTracks();
      }, []);

    async function getTracks() {
      console.log(token)
      const topTracks = await getRecentTracks();
      console.log(topTracks)
      setTracks(topTracks)
      setIds(topTracks?.map(track => track.track.id))
      console.log(topTracks?.map(track => track.track.id))
      console.log(topTracks);
      
      const rec = await getRecommendations();
      setRecommendations(rec)
      const playlst = createPlaylist(ids.map(id =>"spotify:track:"+id))
    }

    async function createPlaylist(type){
      let tracksUri = []
      if(type == "top"){
        tracksUri = tracks?.map(track =>"spotify:track:"+track.track.id)
      }
      else{
        tracksUri = ids?.map(track =>"spotify:track:"+track)
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
                {(tracks!==undefined?"Reccomendations":"Get New Token")}
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
            <Typography id="modal-modal-title"
            variant="h6"
            component="h2"
            align='center'>Create Playlist of</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={(e) => {
                createPlaylist("top")
              }}
            >
              Recently Played
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={(e) => {
                createPlaylist("rec")
              }}
            >
              Recomendations
            </Button>
            <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            align='center'>
                Playlist
            </Typography>
            {hasPlay!=[] && (
              <iframe
              title="Spotify Embed: Recommendation Playlist "
              src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0`  }
              width="100%"
              height="100%"
              style={{ maxHeight: '352px' }}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              />
            )}
        </div>
        
        
    );
}
export default TopTracks;