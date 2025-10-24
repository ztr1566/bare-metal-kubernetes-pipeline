const User = require('../models/userSchema');
const Customer = require('../models/customerSchema');

// GET: Display admin dashboard
const admin_get_dashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-hashedPassword');
    
    const recentCustomers = await Customer.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'email fullName');

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      status: 'admin-dashboard',
      stats: {
        totalUsers,
        totalCustomers,
        totalAdmins
      },
      recentUsers,
      recentCustomers,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    req.flash('error', 'An error occurred loading the dashboard');
    res.redirect('/dashboard');
  }
};

// GET: Display all users
const admin_get_users = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    const users = await User.find()
      .select('-hashedPassword')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalUsers / limit);

    res.render('admin/users', {
      title: 'Manage Users',
      status: 'admin-users',
      users,
      currentPage: page,
      totalPages,
      totalUsers,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Admin users error:', error);
    req.flash('error', 'An error occurred loading users');
    res.redirect('/admin/dashboard');
  }
};

// GET: Display all customers
const admin_get_customers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const totalCustomers = await Customer.countDocuments();
    const customers = await Customer.find()
      .populate('userId', 'email fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCustomers / limit);

    res.render('admin/customers', {
      title: 'Manage Customers',
      status: 'admin-customers',
      customers,
      currentPage: page,
      totalPages,
      totalCustomers,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Admin customers error:', error);
    req.flash('error', 'An error occurred loading customers');
    res.redirect('/admin/dashboard');
  }
};

// POST: Toggle admin status for a user
const admin_post_toggle_admin = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      req.flash('error', 'User ID is required');
      return res.redirect('/admin/users');
    }

    // Prevent user from removing their own admin status
    if (userId === req.session.userId.toString()) {
      req.flash('error', 'You cannot modify your own admin status');
      return res.redirect('/admin/users');
    }

    const user = await User.findById(userId);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/admin/users');
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    req.flash('success', `User ${user.email} admin status updated to: ${user.isAdmin ? 'Admin' : 'Regular User'}`);
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Toggle admin error:', error);
    req.flash('error', 'An error occurred updating user status');
    res.redirect('/admin/users');
  }
};

// DELETE: Delete a user
const admin_delete_user = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      req.flash('error', 'User ID is required');
      return res.redirect('/admin/users');
    }

    // Prevent user from deleting themselves
    if (userId === req.session.userId.toString()) {
      req.flash('error', 'You cannot delete your own account');
      return res.redirect('/admin/users');
    }

    const user = await User.findById(userId);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/admin/users');
    }

    // Delete all customers associated with this user
    await Customer.deleteMany({ userId: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    req.flash('success', `User ${user.email} and their associated customers have been deleted`);
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Delete user error:', error);
    req.flash('error', 'An error occurred deleting the user');
    res.redirect('/admin/users');
  }
};

// DELETE: Delete a customer
const admin_delete_customer = async (req, res) => {
  try {
    const customerId = req.params.id;
    
    if (!customerId) {
      req.flash('error', 'Customer ID is required');
      return res.redirect('/admin/customers');
    }

    const customer = await Customer.findById(customerId);
    
    if (!customer) {
      req.flash('error', 'Customer not found');
      return res.redirect('/admin/customers');
    }

    await Customer.findByIdAndDelete(customerId);

    req.flash('success', `Customer ${customer.firstname} ${customer.lastname} has been deleted`);
    res.redirect('/admin/customers');
  } catch (error) {
    console.error('Delete customer error:', error);
    req.flash('error', 'An error occurred deleting the customer');
    res.redirect('/admin/customers');
  }
};

// GET: Database statistics
const admin_get_stats = async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          admins: {
            $sum: { $cond: ['$isAdmin', 1, 0] }
          },
          regularUsers: {
            $sum: { $cond: ['$isAdmin', 0, 1] }
          }
        }
      }
    ]);

    const customerStats = await Customer.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    const customersByCountry = await Customer.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.render('admin/stats', {
      title: 'Database Statistics',
      status: 'admin-stats',
      userStats: userStats[0] || { total: 0, admins: 0, regularUsers: 0 },
      customerStats,
      customersByCountry,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    req.flash('error', 'An error occurred loading statistics');
    res.redirect('/admin/dashboard');
  }
};

module.exports = {
  admin_get_dashboard,
  admin_get_users,
  admin_get_customers,
  admin_post_toggle_admin,
  admin_delete_user,
  admin_delete_customer,
  admin_get_stats
};
