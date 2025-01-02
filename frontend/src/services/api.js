import axios from 'axios';

const api = axios.create({
    baseURL: 'https://mindsync-bt2a.onrender.com',
    headers: { 'Content-Type': 'application/json' },
});


export const registerUser = async (userData) => {
    return await api.post('/users/register', userData);
};

export const loginUser = async (credentials) => {
    return await api.post('/users/login', credentials);
};

export const getUsers = async (token) => {
    return await api.get('/admin', { headers: { Authorization: `Bearer ${token}` } });
};

export const addUser = async (userData, token) => {
    return await api.post('/admin/addusers', userData, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateUser = async (id, userData, token) => {
    return await api.put(`/admin/user/${id}`, userData, { headers: { Authorization: `Bearer ${token}` } });
};

export const deleteUser = async (id, token) => {
    return await api.delete(`/admin/user/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const deleteUsersBulk = async (ids, token) => {
    return await api.delete(`/admin/user`, {headers: { Authorization: `Bearer ${token}` },data: { ids },});
};
