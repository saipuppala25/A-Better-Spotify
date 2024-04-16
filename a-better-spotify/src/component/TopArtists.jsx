import React, { useState, useEffect } from 'react';
import { fetchWebApi } from "../service/apiService";
import {
    Box,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    FormControl,
    TextField,
    ButtonGroup,
    Button,
    CircularProgress,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { keyframes } from '@mui/system';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';

const gradientBackground = {
    background: 'linear-gradient(90deg, #4B5FBE 0%, #BC55D9 100%)',
    borderRadius: '15px',
    padding: '20px',
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const AnimatedTableCell = ({ children }) => {
    return (
        <TableCell sx={{ animation: `${fadeIn} 0.5s ease`, fontFamily: 'Inter, sans-serif' }}>
            {children}
        </TableCell>
    );
};

function TopArtists({ token, setToken }) {
    const [artists, setArtists] = useState([]);
    const [num, setNum] = useState(50);
    const [alignment, setAlignment] = useState('long_term');
    const [loading, setLoading] = useState(false);

    const handleAlignment = (event, newAlignment) => {
        if (newAlignment != null) {
            setAlignment(newAlignment);
        }
    };
    
    async function getTopArtists() {
        setLoading(true);
        try {
            const response = await fetchWebApi(
                token, 'v1/me/top/artists?time_range='+alignment+'&limit='+num, 'GET'
            );
            console.log(response)
            setArtists(response.items);
        } catch (error) {
            console.error('Error fetching top artists:', error);
            // Handle error gracefully, e.g., show a message to the user
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(token!==""){
            getTopArtists();
        }
    }, [num, alignment,token]);

    return (
        <Paper elevation={3} sx={{ ...gradientBackground, color: 'white', fontFamily: 'Inter, sans-serif' }}>
            <Typography variant="h4" align="center" gutterBottom>
                {loading ? 'Loading...' : (artists.length > 0 ? `Top ${num} Artists` : 'Get New Token')}
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <AnimatedTableCell>
                                <Typography variant="h6"><strong>Name</strong></Typography>
                            </AnimatedTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {artists.map(artist => (
                            <TableRow key={artist.id}>
                                <AnimatedTableCell>
                                    <Typography variant="body1">{artist.name}</Typography>
                                </AnimatedTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box mt={2} display="flex" alignItems="center" justifyContent="center">
                {/* <FormControl sx={{ mr: 2 }}>
                    <TextField
                        label="Number of Artists"
                        type="number"
                        variant="outlined"
                        value={num}
                        onChange={(e) => setNum(e.target.value)}
                        InputProps={{
                            style: { color: 'white', fontFamily: 'Inter, sans-serif' }
                        }}
                        InputLabelProps={{
                            style: { color: 'white', fontFamily: 'Inter, sans-serif' }
                        }}
                    />
                </FormControl> */}
                <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                >
                    <ToggleButton value="long_term" sx={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', fontFamily: 'Inter, sans-serif' }}>12 Months</ToggleButton>
                    <ToggleButton value="medium_term" sx={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', fontFamily: 'Inter, sans-serif' }}>6 Months</ToggleButton>
                    <ToggleButton value="short_term" sx={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', fontFamily: 'Inter, sans-serif' }}>1 Month</ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Paper>
    );
}

export default TopArtists;
