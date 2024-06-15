import React from 'react';
import { Box, Typography } from '@mui/material';

const NoData = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Typography variant="h5" gutterBottom>No Breweries Found</Typography>
      <Typography variant="body1">Try searching for a different city, name, or type.</Typography>
    </Box>
  );
};

export default NoData;
