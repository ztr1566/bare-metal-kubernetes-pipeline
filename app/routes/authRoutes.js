const router = require('express').Router();
const authController = require('../controllers/authController');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');
const upload = require('../config/multerConfig');

// Rate limiter for login attempts (10 failed attempts per email per 15 minutes)
// This allows multiple devices to login with the same account
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each email to 10 failed login attempts per windowMs
  message: 'Too many failed login attempts for this account. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  // Use email as key instead of IP to allow multiple device logins
  keyGenerator: (req, res) => {
    // If email is provided, use it as the key
    if (req.body && req.body.email) {
      return req.body.email.toLowerCase();
    }
    // Otherwise, use a default key (this shouldn't happen in normal flow)
    return 'anonymous';
  },
  // Only count failed login attempts
  skipSuccessfulRequests: true,
});

// Rate limiter for registration (5 attempts per IP per hour)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many registration attempts. Please try again after an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Login routes
router.get('/login', isNotAuthenticated, authController.auth_get_login);
router.post('/login', isNotAuthenticated, loginLimiter, authController.auth_post_login);

// Registration routes
router.get('/register', isNotAuthenticated, authController.auth_get_register);
router.post('/register', isNotAuthenticated, registerLimiter, upload.single('profilePhoto'), authController.auth_post_register);

// Logout route
router.get('/logout', isAuthenticated, authController.auth_get_logout);

module.exports = router;
