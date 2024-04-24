import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';

function Mode({ toggleLightMode }) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Initially set to dark mode

  const handleModeChange = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    toggleLightMode(newMode);
  };
  // For some reason, the mode change is goofy if you name it light or dark mode, it switches to dark mode auto. So I have it static at changeMode.
  return (
    <div style={{ textAlign: 'center', maxWidth: 300, margin: 'auto' }}>
      <Button variant="contained" onClick={handleModeChange}>
        {isDarkMode ? 'Change Mode' : 'Change Mode'} 
      </Button>
    </div>
  );
}

export default Mode;
