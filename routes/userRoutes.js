const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();

// Register new user (Admin)
router.post('/register', authMiddleware, authorizeRole('admin'), async (req, res) => {

  const {username, password, role} = req.body;

  if (!['admin', 'user', 'stockManager'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }


  const user = await User.create({username, password, role})
  
  if (user) {
      res.status(201).json({
        _id : user._id,
            username : user.username,
            password : user.password,
            role : user.role,
            token : token(user._id)
        })

    } else {
        res.status(400).json({message: 'Invalid User Data'})
    }

});


const token = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

}


// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id : user._id,
      username : user.username,
      password : user.password,
      role : user.role,
      token : token(user._id)
    })
  }
});


// Get all users (Admin)
router.get('/', authMiddleware, authorizeRole('admin'), async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Delete user (Admin)
router.delete('/:id', authMiddleware, authorizeRole('admin'), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User removed' });
});

module.exports = router;
