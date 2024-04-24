import React, { useState, useEffect } from 'react';
import {
  AppBar, Box, Toolbar, IconButton, Typography, Menu, Container,
  Avatar, Button, Tooltip, MenuItem, Link
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';

const pages = ['Top Tracks', 'Top Artists', 'Playlists', 'Recommendations', 'Mode'];
const hrefs = ['/top-tracks', '/top-artists', '/playlists', '/moods', '/mode'];

function TopBar({ token, setToken }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUserProfile(token).then(data => {
        setUserProfile(data);
      }).catch(error => {
        console.error('Error fetching user profile:', error);
      });
    }
  }, [token]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    setToken(null); // Clears the user token
    setUserProfile(null); // Clears user data
    // Optionally redirect to login or do additional cleanup
  };

  const fetchUserProfile = async (token) => {
    const headers = new Headers({
      Authorization: `Bearer ${token}`
    });

    const response = await fetch('https://api.spotify.com/v1/me', { headers });
    const data = await response.json();
    return data;
  };

  return (
    <React.Fragment>
      <AppBar position="fixed" color="success" sx={{ background: 'linear-gradient(90deg, #4B5FBE 0%, #BC55D9 100%)' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#responsive"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'inherit',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              A Better Spotify
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page, index) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Link href={hrefs[index]} underline="none" color="inherit">
                      {page}
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page, index) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  href={hrefs[index]}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src={userProfile?.images[0]?.url || '/static/images/avatar/default.jpg'} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-user"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar /> {/* This is to ensure the content below the AppBar is not hidden behind it. */}
    </React.Fragment>
  );
}

export default TopBar;
