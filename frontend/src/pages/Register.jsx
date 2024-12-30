import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

function Register() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'User' });
  const history = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      history('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <TextField label="First Name" name="firstName" onChange={handleChange} required />
        <TextField label="Last Name" name="lastName" onChange={handleChange} required />
        <TextField label="Email" name="email" onChange={handleChange} required />
        <TextField label="Password" name="password" type="password" onChange={handleChange} required />
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}

export default Register;
