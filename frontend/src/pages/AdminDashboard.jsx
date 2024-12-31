import React, { useEffect, useState } from 'react';
import { getUsers, addUser, updateUser, deleteUser, deleteUsersBulk } from '../services/api';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, Skeleton, Snackbar } from '@mui/material';
import "../style/Admindashboard.css";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmationDialog from './ConfirmationDialog';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../redux/actions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [confirmationDialogAction, setConfirmationDialogAction] = useState(null);
  const [confirmationDialogMessage, setConfirmationDialogMessage] = useState('');
  const [confirmationDialogTitle, setConfirmationDialogTitle] = useState('');
  const [confirmationDialogLabel, setConfirmationDialogLabel] = useState('');
  const history = useNavigate();
  const dispatch = useDispatch();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers(token);
      setAllUsers(response.data);
      setUsers(response.data.slice(0, itemsPerPage));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        setSnackbarMessage('User updated successfully!');
        setSnackbarSeverity('success');
      } else {
        await addUser(userForm, token);
        setSnackbarMessage('User added successfully!');
        setSnackbarSeverity('success');
      }
      fetchUsers();
      handleClose();
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSnackbarMessage('Something went wrong!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = (userId) => {
    setConfirmationDialogTitle('Delete User');
    setConfirmationDialogMessage('Are you sure you want to delete this user?');
    setConfirmationDialogLabel('Delete');
    setConfirmationDialogAction(() => async () => {
      try {
        await deleteUser(userId, token);
        setSnackbarMessage('User deleted successfully!');
        setSnackbarSeverity('success');
        fetchUsers();
      } catch (err) {
        console.error(err);
        setSnackbarMessage('Failed to delete user!');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
    });
    setConfirmationDialogOpen(true);
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

  const handleDeleteSelected = () => {
    setConfirmationDialogTitle('Delete Selected Users');
    setConfirmationDialogMessage('Are you sure you want to delete selected users?');
    setConfirmationDialogLabel('Delete');
    setConfirmationDialogAction(() => async () => {
      try {
        await deleteUsersBulk(selectedUsers, token);
        setSnackbarMessage('Selected users deleted successfully!');
        setSnackbarSeverity('success');
        fetchUsers();
        setSelectedUsers([]);
        setSelectAll(false);
      } catch (err) {
        console.error(err);
        setSnackbarMessage('Failed to delete selected users!');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
    });
    setConfirmationDialogOpen(true);
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
  const handleLogout = () => {
    setConfirmationDialogTitle("Confirm Logout");
    setConfirmationDialogMessage("Are you sure you want to logout?");
    setConfirmationDialogLabel("Logout");
    setConfirmationDialogAction(() => async () => {
      localStorage.removeItem('token');
      dispatch(logout());
      history('/register');
      setSnackbarMessage("Logged out successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    });
    setConfirmationDialogOpen(true);
  };
  
  return (
    <div>
      <div className='header'>
      <h2>Admin Dashboard</h2>
      <Button onClick={() => handleLogout()}><LogoutIcon sx={{ color: 'red' }}/></Button>
      </div>
      {loading ? (
        <Skeleton animation="wave" />
      ) : (
        <div className='topbar'>
          <p className='allusers'>All Users: <span className='usercount'>{users?.length}</span></p>
          <div className='searchbar'>
            <TextField
              label="Search User"
              variant="outlined"
              value={searchQuery}
              placeholder='Search by name'
              onChange={handleSearchChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <div className='button-container'>
              <Button variant="contained" sx={{ padding: '16px 40px', mr: 1 }} onClick={() => handleOpen()}>
                <AddIcon sx={{ mr: 1 }} /> Add User
              </Button>

              <Button variant="contained" color="error" sx={{ padding: '16px 48px' }} onClick={handleDeleteSelected} disabled={selectedUsers.length === 0}>
                <DeleteIcon sx={{ mr: 1 }} />Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="table-wrapper">
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
            {loading ? (
              Array.from({ length: itemsPerPage }).map((_, idx) => (
                <tr key={idx}>
                  <td><Skeleton variant="rectangular" width={40} height={40} /></td>
                  <td><Skeleton variant="text" width="100%" /></td>
                  <td><Skeleton variant="text" width="100%" /></td>
                  <td><Skeleton variant="text" width="100%" /></td>
                  <td><Skeleton variant="text" width="100%" /></td>
                  <td><Skeleton variant="text" width="100%" /></td>
                  <td><Skeleton variant="rectangular" width={80} height={40} /></td>
                </tr>
              ))
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <Checkbox checked={selectedUsers.includes(user._id)} onChange={() => handleSelectUser(user._id)} />
                  </td>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.lastActive && !isNaN(new Date(user.lastActive)) ? (
                      <>
                        {new Date(user.lastActive).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        {new Date(user.lastActive).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {new Date(user.dateAdded).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    {new Date(user.dateAdded).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </td>
                  <td>
                    <Button onClick={() => handleOpen(user)}><ModeEditIcon /></Button>
                    <Button color="error" onClick={() => handleDelete(user._id)}><DeleteForeverIcon /></Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div>
        <Button onClick={() => goToPage(1)} disabled={currentPage === 1}>First</Button>
        <Button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Prev</Button>
        <span>{currentPage} / {totalPages}</span>
        <Button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
        <Button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>Last</Button>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      <ConfirmationDialog
        open={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
        onConfirm={confirmationDialogAction}
        message={confirmationDialogMessage}
        actionLabel={confirmationDialogLabel}
        title={confirmationDialogTitle}
      />

      <Dialog open={open} onClose={handleClose} sx={{ padding: '10px', minWidth: '400px' }}>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          <TextField
            sx={{ padding: '3px' }}
            name="firstName"
            label="First Name"
            value={userForm.firstName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            sx={{ padding: '3px' }}
            name="lastName"
            label="Last Name"
            value={userForm.lastName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            sx={{ padding: '3px' }}
            name="email"
            label="Email"
            value={userForm.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            sx={{ padding: '3px' }}
            name="password"
            label="Password"
            type="password"
            value={userForm.password}
            onChange={handleChange}
            fullWidth
          />
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
