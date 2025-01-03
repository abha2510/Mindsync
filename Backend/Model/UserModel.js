const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'User'], default: 'User' },
    dateAdded: { type: Date, default: Date.now },
    lastActive: Date,
}, { versionKey: false }
)

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel };
