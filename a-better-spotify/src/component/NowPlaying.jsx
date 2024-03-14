import React, { useState } from 'react';
import { fetchWebApi } from "../service/apiService";
import { Button, Typography } from '@mui/material';

function NowPlaying({ token }) {
    const [nowPlaying, setNowPlaying] = useState(null);

    const getNowPlaying = async () => {
        try {
            console.log("Fetching now playing...");
            const response = await fetchWebApi(token, 'v1/me/player/currently-playing', 'GET');
            console.log("Response:", response);
            if (response && response.item) {
                setNowPlaying({
                    name: response.item.name,
                    artist: response.item.artists.map(artist => artist.name).join(', '),
                    album: response.item.album.name,
                });
            } else {
                setNowPlaying(null);
            }
        } catch (error) {
            console.error("Error fetching now playing:", error);
            setNowPlaying(null);
        }
    };

    return (
        <div style={{ padding: '0.8rem', background: "#53bd58" }}>
            <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                align='center'
            >
                Now Playing
            </Typography>
            <Button variant="contained" color="primary" onClick={getNowPlaying}>
                Get Now Playing
            </Button>
            {nowPlaying && (
                <div>
                    <Typography variant="body1">Name: {nowPlaying.name}</Typography>
                    <Typography variant="body1">Artist: {nowPlaying.artist}</Typography>
                    <Typography variant="body1">Album: {nowPlaying.album}</Typography>
                </div>
            )}
        </div>
    );
}

export default NowPlaying;
