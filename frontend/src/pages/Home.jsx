import React, { useState } from 'react';
import Register from './Register'; 
import Login from './Login'; 
import { Box, Button } from '@mui/material';

const Home = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div>
      <Box maxWidth={400}
        margin="0 auto">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        {isRegistering ? <Register /> : <Login />}

        <Button onClick={toggleForm} variant="outlined" sx={{ marginTop: '20px' }} >
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </Button>
      </Box>

    </div>
  );
}

export default Home;
