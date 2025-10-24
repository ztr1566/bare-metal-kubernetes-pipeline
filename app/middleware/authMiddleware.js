// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  req.flash('error', 'Please log in to access this page');
  res.redirect('/auth/login');
};

// Middleware to check if user is NOT authenticated (for login/register pages)
const isNotAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  next();
};

// Middleware to make user data available to all views
const setUserLocals = async (req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  
  if (req.session && req.session.userId) {
    try {
      const User = require('../models/userSchema');
      const user = await User.findById(req.session.userId);
      res.locals.currentUser = user;
    } catch (error) {
      res.locals.currentUser = null;
    }
  } else {
    res.locals.currentUser = null;
  }
  
  next();
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    req.flash('error', 'Please log in to access this page');
    return res.redirect('/auth/login');
  }

  try {
    const User = require('../models/userSchema');
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }

    if (!user.isAdmin) {
      req.flash('error', 'Access denied. Admin privileges required.');
      return res.redirect('/dashboard');
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    req.flash('error', 'An error occurred');
    res.redirect('/dashboard');
  }
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  setUserLocals,
  isAdmin
};
