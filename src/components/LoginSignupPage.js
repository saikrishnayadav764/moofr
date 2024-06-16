import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const LoginSignupPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupMessage, setSignupMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [token, setToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission status

  const navigate = useNavigate();

  useEffect(() => {
    const existingToken = Cookies.get('token');
    if (existingToken) {
      setToken(existingToken);
      setIsLoggedIn(true);
      navigate('/search');
    }
  }, [navigate]);

  const apiUrl = 'https://moobe-production.up.railway.app/api/auth';
  const endpoint = isSignup ? `${apiUrl}/register` : `${apiUrl}/login`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = isSignup
      ? { username: username, email: email, password: password }
      : { email: email, password: password };

    try {
      const response = await axios.post(endpoint, formData);
      const responseData = response.data;

      setSignupMessage(responseData.message);

      const authToken = responseData.token;
      setToken(authToken);
      Cookies.set('token', authToken, { expires: 7 });
      Cookies.set('username', responseData.username, { expires: 7 });

      setIsLoggedIn(true);

      navigate('/search');
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        setSignupMessage(error.response.data.message);
      } else {
        setSignupMessage('Operation failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchMode = () => {
    setIsSignup(!isSignup);
    setSignupMessage('');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isSignup ? 'Sign Up' : 'Login'}
        </Typography>
        {signupMessage && (
          <Typography variant="body1" color={signupMessage.includes('successful') ? 'primary' : 'error'}>
            {signupMessage}
          </Typography>
        )}
        {!isLoggedIn ? (
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                required
              />
            )}
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => {
                const value = e.target.value.trim();
                setEmail(value);
                if (!validateEmail(value)) {
                  setSignupMessage('Invalid email format');
                } else {
                  setSignupMessage('');
                }
              }}
              required
              error={signupMessage === 'Invalid email format'}
              helperText={signupMessage === 'Invalid email format' ? 'Please enter a valid email' : ''}
            />
            <TextField
              fullWidth
              label="Password"
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              {isSignup ? 'Sign Up' : 'Login'}
            </Button>
            {isSubmitting && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {isSignup ? 'Signing up. Please wait...' : 'Logging in. Please wait...'}
              </Typography>
            )}
            <Button
              onClick={handleSwitchMode}
              fullWidth
              sx={{ mt: 1 }}
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </Button>
          </form>
        ) : (
          <Typography variant="body1" color="primary">
            Logged in successfully!
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default LoginSignupPage;
