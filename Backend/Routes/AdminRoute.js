const express = require('express');
const adminRouter = express.Router();
const { UserModel } = require('../Model/UserModel');
const bcrypt = require('bcrypt');
const { verifyAdmin } = require('../Middleware/verifyAdmin');


adminRouter.get('/', verifyAdmin, async (req, res) => {
    try {
        const users = await UserModel.find({ role: 'User' });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users.", error: error.message });
    }
});

adminRouter.post('/addusers', verifyAdmin, async (req, res) => {
    const { firstName, lastName, email, password, role = 'User' } = req.body;
    try {
      const hashPass = await bcrypt.hash(password, 7);
      const newUser = new UserModel({
        firstName,
        lastName,
        email,
        password: hashPass,
        role,
        dateAdded: new Date(),
      });
      await newUser.save();
      res.status(201).json({ message: 'User added successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add user.', error: error.message });
    }
  });
  
  adminRouter.put('/user/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const updates = { ...req.body, lastActive: new Date() };
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(id, updates, { new: true });
      res.status(200).json({ message: 'User updated successfully.', updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update user.', error: error.message });
    }
  });
  
adminRouter.delete('/user/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user.", error: error.message });
    }
});

adminRouter.delete('/user', verifyAdmin, async (req, res) => {
    const { ids } = req.body;
    try {
        if (!ids || ids.length === 0) {
            return res.status(400).json({ message: "No user IDs provided for deletion." });
        }

        const result = await UserModel.deleteMany({ _id: { $in: ids } });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No users found to delete." });
        }

        res.status(200).json({ 
            message: `${result.deletedCount} user(s) deleted successfully.` 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Failed to delete users.", 
            error: error.message 
        });
    }
});

module.exports = { adminRouter };
