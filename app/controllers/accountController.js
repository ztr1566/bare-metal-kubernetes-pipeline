const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// GET: Display account settings page
const account_get_settings = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }

    res.render('account/settings', { 
      title: 'Account Settings',
      user: user,
      status: 'settings',
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Account settings error:', error);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/dashboard');
  }
};

// POST: Update account information
const account_post_update = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }

    // Check if email is being changed and if it's already taken
    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        req.flash('error', 'Email is already in use');
        return res.redirect('/account/settings');
      }
      user.email = email.toLowerCase();
      req.session.userEmail = email.toLowerCase();
    }

    // Update full name
    if (fullName !== undefined) {
      user.fullName = fullName;
    }

    await user.save();
    
    req.flash('success', 'Account information updated successfully');
    res.redirect('/account/settings');
  } catch (error) {
    console.error('Account update error:', error);
    req.flash('error', 'An error occurred while updating your account');
    res.redirect('/account/settings');
  }
};

// POST: Update profile photo
const account_post_photo = async (req, res) => {
  try {
    if (!req.file) {
      req.flash('error', 'Please select a photo to upload');
      return res.redirect('/account/settings');
    }

    const user = await User.findById(req.session.userId);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }

    // Delete old photo if it's not the default
    if (user.profilePhoto && user.profilePhoto !== '/img/profile.png') {
      const oldPhotoPath = path.join(__dirname, '..', 'public', user.profilePhoto);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Save new photo path
    user.profilePhoto = '/uploads/' + req.file.filename;
    await user.save();
    
    req.flash('success', 'Profile photo updated successfully');
    res.redirect('/account/settings');
  } catch (error) {
    console.error('Photo upload error:', error);
    req.flash('error', 'An error occurred while uploading your photo');
    res.redirect('/account/settings');
  }
};

// POST: Change password
const account_post_password = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      req.flash('error', 'Current password is incorrect');
      return res.redirect('/account/settings');
    }

    // Validate new password
    if (newPassword !== confirmPassword) {
      req.flash('error', 'New passwords do not match');
      return res.redirect('/account/settings');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      req.flash('error', 'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return res.redirect('/account/settings');
    }

    // Update password
    user.hashedPassword = newPassword; // Will be hashed by pre-save hook
    await user.save();
    
    req.flash('success', 'Password changed successfully');
    res.redirect('/account/settings');
  } catch (error) {
    console.error('Password change error:', error);
    req.flash('error', 'An error occurred while changing your password');
    res.redirect('/account/settings');
  }
};

module.exports = {
  account_get_settings,
  account_post_update,
  account_post_photo,
  account_post_password
};
