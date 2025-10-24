const User = require('../models/userSchema');

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // Password must be at least 8 characters, contain at least one uppercase, one lowercase, one number, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// GET: Display login page
const auth_get_login = (req, res) => {
  res.render('auth/login', { 
    title: 'Login',
    error: req.flash('error'),
    success: req.flash('success')
  });
};

// POST: Handle login
const auth_post_login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Client-side validation
    if (!email || !password) {
      req.flash('error', 'Please provide both email and password');
      return res.redirect('/auth/login');
    }

    if (!validateEmail(email)) {
      req.flash('error', 'Please provide a valid email address');
      return res.redirect('/auth/login');
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/auth/login');
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/auth/login');
    }

    // Create session
    req.session.userId = user._id;
    req.session.userEmail = user.email;

    req.flash('success', 'Login successful! Welcome back.');
    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'An error occurred during login. Please try again.');
    res.redirect('/auth/login');
  }
};

// GET: Display registration page
const auth_get_register = (req, res) => {
  res.render('auth/register', { 
    title: 'Register',
    error: req.flash('error'),
    success: req.flash('success')
  });
};

// POST: Handle registration
const auth_post_register = async (req, res) => {
  try {
    const { email, password, confirmPassword, fullName } = req.body;

    // Validation
    if (!email || !password || !confirmPassword) {
      req.flash('error', 'Please fill in all required fields');
      return res.redirect('/auth/register');
    }

    if (!validateEmail(email)) {
      req.flash('error', 'Please provide a valid email address');
      return res.redirect('/auth/register');
    }

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/auth/register');
    }

    if (!validatePassword(password)) {
      req.flash('error', 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)');
      return res.redirect('/auth/register');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      req.flash('error', 'An account with this email already exists');
      return res.redirect('/auth/register');
    }

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      hashedPassword: password, // Will be hashed by the pre-save hook
      fullName: fullName || '',
      profilePhoto: req.file ? '/uploads/' + req.file.filename : '/img/profile.png'
    });

    await newUser.save();

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      req.flash('error', 'An account with this email already exists');
    } else {
      req.flash('error', 'An error occurred during registration. Please try again.');
    }
    
    res.redirect('/auth/register');
  }
};

// GET: Handle logout
const auth_get_logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/dashboard');
    }
    res.redirect('/auth/login');
  });
};

// GET: Display dashboard
const auth_get_dashboard = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }

    // Get user statistics
    const Customer = require('../models/customerSchema');
    
    const totalCustomers = await Customer.countDocuments({ userId: req.session.userId });
    
    const recentCustomers = await Customer.find({ userId: req.session.userId })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Gender distribution
    const genderStats = await Customer.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Country distribution
    const countryStats = await Customer.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Average age
    const ageStats = await Customer.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          avgAge: { $avg: '$age' },
          minAge: { $min: '$age' },
          maxAge: { $max: '$age' }
        }
      }
    ]);

    res.render('auth/dashboard', { 
      title: 'Dashboard',
      user: user,
      stats: {
        totalCustomers,
        genderStats,
        countryStats,
        ageStats: ageStats[0] || { avgAge: 0, minAge: 0, maxAge: 0 }
      },
      recentCustomers,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/auth/login');
  }
};

module.exports = {
  auth_get_login,
  auth_post_login,
  auth_get_register,
  auth_post_register,
  auth_get_logout,
  auth_get_dashboard
};
