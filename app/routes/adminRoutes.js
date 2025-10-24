const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin dashboard
router.get('/dashboard', adminController.admin_get_dashboard);

// User management
router.get('/users', adminController.admin_get_users);
router.post('/users/toggle-admin', adminController.admin_post_toggle_admin);
router.delete('/users/:id', adminController.admin_delete_user);

// Customer management
router.get('/customers', adminController.admin_get_customers);
router.delete('/customers/:id', adminController.admin_delete_customer);

// Statistics
router.get('/stats', adminController.admin_get_stats);

module.exports = router;
