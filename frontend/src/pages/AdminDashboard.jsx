import React, { useEffect, useState } from 'react';
import { getUsers, addUser, updateUser, deleteUser, deleteUsersBulk } from '../services/api';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox } from '@mui/material';
import "../style/Admindashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); 
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const token = localStorage.getItem('token');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;  

  const fetchUsers = async () => {
    try {
      const response = await getUsers(token);
      setAllUsers(response.data);  
      setUsers(response.data.slice(0, itemsPerPage)); 
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleOpen = (user = null) => {
    setEditingUser(user);
    if (user) {
      setUserForm({ ...user, password: '' });
    } else {
      setUserForm({ firstName: '', lastName: '', email: '', password: '' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await updateUser(editingUser._id, userForm, token);
      } else {
        await addUser(userForm, token);
      }
      fetchUsers();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId, token);
        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user._id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = async () => {
    if (window.confirm('Are you sure you want to delete selected users?')) {
      try {
        await deleteUsersBulk(selectedUsers, token);
        fetchUsers();
        setSelectedUsers([]);
        setSelectAll(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === '') {
      setUsers(allUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));  
    } else {
      const filteredUsers = allUsers.filter((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query.toLowerCase())
      );
      setUsers(filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));  
    }
  };

  const totalPages = Math.ceil(allUsers.length / itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedUsers = allUsers.slice(startIndex, startIndex + itemsPerPage);
    setUsers(paginatedUsers);
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <TextField
        label="Search User"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
      />
      <Button variant="contained" onClick={() => handleOpen()}>Add User</Button>
      <Button variant="contained" color="error" onClick={handleDeleteSelected} disabled={selectedUsers.length === 0}>
        Delete Selected
      </Button>
      <table>
        <thead>
          <tr>
            <th>
              <Checkbox checked={selectAll} onChange={handleSelectAll} />
            </th>
            <th>Username</th>
            <th>Email</th>
            <th>Access</th>
            <th>Last Active</th>
            <th>Date Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <Checkbox checked={selectedUsers.includes(user._id)} onChange={() => handleSelectUser(user._id)} />
              </td>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.lastActive || "-"}</td>
              <td>{user.dateAdded}</td>
              <td>
                <Button onClick={() => handleOpen(user)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(user._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <Button onClick={() => goToPage(1)} disabled={currentPage === 1}>First</Button>
        <Button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Prev</Button>
        <span>{currentPage} / {totalPages}</span>
        <Button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
        <Button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>Last</Button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField name="firstName" label="First Name" value={userForm.firstName} onChange={handleChange} fullWidth />
          <TextField name="lastName" label="Last Name" value={userForm.lastName} onChange={handleChange} fullWidth />
          <TextField name="email" label="Email" value={userForm.email} onChange={handleChange} fullWidth />
          <TextField name="password" label="Password" type="password" value={userForm.password} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{editingUser ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminDashboard;
