const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {

  let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
       try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');
        next();

       } catch (error) {
        res.status(401).json({message: 'Not Authorised, token failed', error: error.message})
       } 
    }

    if (!token) {
      res.status(401).json({message: 'Not Authorised, No token available'})
  }
};


  // const token = req.header('Authorization')?.replace('Bearer ', '');
  // if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = await User.findById(decoded.id).select('-password');
  //   next();
  // } catch (error) {
  //   res.status(401).json({ message: 'Token is not valid' });
  // }
// };

const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { authMiddleware, authorizeRole };
