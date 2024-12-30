const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel } = require("../Model/UserModel");

const JWT_SECRET_KEY = process.env.JWT_SECRET


userRouter.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    if (!firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({ message: "All fields, including role, are required." });
    }
    if (!['Admin', 'User'].includes(role)) {
        return res.status(400).json({ message: "Invalid role specified." });
    }
    try {
        const isPresent = await UserModel.findOne({ email });
        if (isPresent) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashPass = await bcrypt.hash(password, 7);
        const user = new UserModel({ firstName, lastName, email, password: hashPass, role });
        await user.save();
        return res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});


userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL; 
    const adminPassword = process.env.ADMIN_PASSWORD; 

    if (email === adminEmail && password === adminPassword) {
        const token = jwt.sign(
            { id: 'admin_id', role: 'Admin' }, 
            JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
        return res.status(200).json({
            message: "Login successful",
            token,
            userId: 'admin_id',
            role: 'Admin',
        });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "Invalid email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        return res.status(200).send({
            message: "Login successful",
            token,
            userId: user._id,
            role: user.role
        });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong", error: error.message });
    }
});


userRouter.post("/logout", (req, res) => {
    return res.status(200).json({ message: "Logged out successfully" });
});





module.exports = { userRouter }