import React, { useState, useEffect } from 'react';
import { Container, TextField, Box, Typography, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import NoData from './NoData'; 
import Cookies from 'js-cookie';


const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBreweries = async () => {
      setLoading(true);
      try {
        let endpoint;
        if (query.trim()) {
          const encodedQuery = encodeURIComponent(query); 
          endpoint = `https://api.openbrewerydb.org/v1/breweries/search?page=${currentPage}&query=${encodedQuery}&per_page=9`;
        } else {
          endpoint = `https://api.openbrewerydb.org/v1/breweries/?per_page=9`;
        }
        const response = await axios.get(endpoint);
        setBreweries(response.data);
      } catch (error) {
        console.error('Error fetching breweries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBreweries();
  }, [query, currentPage]);

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1)); 
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/')
    console.log('Logged out');
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" gutterBottom>Search Breweries</Typography>
          <Button onClick={handleLogout} variant="contained" color="error">Logout</Button>
        </Box>
        <Box sx={{ display: 'flex', mb: 4 }}>
          <TextField
            fullWidth
            label="Search by city, name, or type"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : breweries.length === 0 ? (
          <NoData />
        ) : (
          <Box>
            <Grid container spacing={2}>
              {breweries.map((brewery) => (
                <Grid item xs={12} sm={6} md={4} key={brewery.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6">{brewery.name}</Typography>
                      <Typography variant="body2">{brewery.city}, {brewery.state}</Typography>
                      <Typography variant="body2">{brewery.phone}</Typography>
                      <Typography variant="body2">
                        <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">
                          {brewery.website_url}
                        </a>
                      </Typography>
                      <Button component={Link} to={`/brewery/${brewery.id}`} variant="contained" color="primary" sx={{ mt: 2 }}>
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button onClick={handlePrevPage} disabled={currentPage === 1} sx={{ mr: 2 }}>Previous Page</Button>
              <Button onClick={handleNextPage}>Next Page</Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SearchPage;
