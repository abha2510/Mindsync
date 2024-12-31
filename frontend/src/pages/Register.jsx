import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

function Register() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'User' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
  const history = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      setSnackbarMessage('Registration successful! Please log in.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => history('/login'), 2000); 
    } catch (err) {
      setSnackbarMessage('Registration failed. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          maxWidth={400} 
          margin="0 auto"
        >
          <TextField label="First Name" name="firstName" onChange={handleChange} required />
          <TextField label="Last Name" name="lastName" onChange={handleChange} required />
          <TextField label="Email" name="email" onChange={handleChange} required />
          <TextField label="Password" name="password" type="password" onChange={handleChange} required />
          <Button type="submit" variant="contained" color="primary">Register</Button>
        </Box>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Register;
