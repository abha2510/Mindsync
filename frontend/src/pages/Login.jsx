import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useDispatch } from 'react-redux';
import { loginUser } from '../services/api';
import { login } from '../redux/actions';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openModal, setOpenModal] = useState(false); 
  const dispatch = useDispatch();
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      const { token, role, userId } = response.data;
      dispatch(login(token, role, userId));
      localStorage.setItem('token', token);

      if (role === 'Admin') {
        history('/admin');
      } else {
        setSnackbarMessage('Login successful!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setOpenModal(true); 
      }
    } catch (err) {
      setSnackbarMessage('Invalid credentials. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const handleProceed = () => {
    setOpenModal(false);
    history('/login'); 
    setEmail("")
    setPassword("")
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

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
          <TextField
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            helperText="admin@gmail.com"
          />
          <TextField
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            helperText="admin123"
          />

          <Button type="submit" variant="contained" color="primary">Login</Button>
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

      {/* Modal for non-admin users */}
      <Dialog open={openModal} onClose={handleCancel}>
        <DialogTitle>Login Successful</DialogTitle>
        <DialogContent>
          <p>You are logged in as a regular user. To login as an Admin, use:</p>
          <p>Email: admin@gmail.com</p>
          <p>Password: admin123</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleProceed} color="primary">
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Login;
