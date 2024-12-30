import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { loginUser } from '../services/api';
import { login } from '../redux/actions';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      const { token, role, userId } = response.data;
      dispatch(login(token, role, userId));
      localStorage.setItem('token', token);
      history(role === 'Admin' ? '/admin' : '/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <TextField label="Email" onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}

export default Login;
