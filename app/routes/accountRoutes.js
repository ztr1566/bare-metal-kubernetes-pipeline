const router = require('express').Router();
const accountController = require('../controllers/accountController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

// All account routes require authentication
router.use(isAuthenticated);

// Account settings page
router.get('/settings', accountController.account_get_settings);

// Update account information
router.post('/update', accountController.account_post_update);

// Update profile photo
router.post('/photo', upload.single('profilePhoto'), accountController.account_post_photo);

// Change password
router.post('/password', accountController.account_post_password);

module.exports = router;
