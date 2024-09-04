const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();

// Register new user (Admin)
router.post('/register', authMiddleware, authorizeRole('admin'), async (req, res) => {
  const { username, password, role } = req.body;
  const user = new User({ username, password, role });
  await user.save();
  res.status(201).json(user);
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

//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }
//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//   res.json({ token });
// });

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
