// index.js
const express = require('express');
const mongoose = require('mongoose');
const User = require('./userModel');

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/student', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

/**
 * CREATE - Add a new user
 */
app.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.send("User registered successfully");
    } catch (error) {
        res.status(500).send("Error registering user: " + error);
    }
});

/**
 * READ - Get user by email and password (login)
 */
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne(req.body);
        if (!user) {
            return res.send("User not found");
        }
        res.json(user);
    } catch (error) {
        res.status(500).send("Login failed: " + error);
    }
});

/**
 * UPDATE - Update user by ID
 */
app.put('/update/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.send("User not found");
        res.json(user);
    } catch (error) {
        res.status(500).send("Update failed: " + error);
    }
});

/**
 * DELETE - Delete user by ID
 */
app.delete('/delete/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.send("User not found");
        res.send("User deleted successfully");
    } catch (error) {
        res.status(500).send("Delete failed: " + error);
    }
});

app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");
});
