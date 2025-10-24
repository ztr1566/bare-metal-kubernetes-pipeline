require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../models/userSchema');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    console.log('\n=== Create Root Admin Account ===\n');

    // Get admin details
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char): ');
    const confirmPassword = await question('Confirm password: ');
    const fullName = await question('Enter full name (optional): ');

    // Validate email
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      console.error('Error: Invalid email address');
      process.exit(1);
    }

    // Validate password
    if (password !== confirmPassword) {
      console.error('Error: Passwords do not match');
      process.exit(1);
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      console.error('Error: Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      // Update existing user to admin
      const updateExisting = await question(`User with email ${email} already exists. Make them admin? (yes/no): `);
      if (updateExisting.toLowerCase() === 'yes' || updateExisting.toLowerCase() === 'y') {
        existingUser.isAdmin = true;
        if (fullName) existingUser.fullName = fullName;
        await existingUser.save();
        console.log('\n✓ User updated to admin successfully!');
        console.log(`Email: ${existingUser.email}`);
        console.log(`Admin: ${existingUser.isAdmin}`);
      } else {
        console.log('Operation cancelled');
      }
    } else {
      // Create new admin user
      const newAdmin = new User({
        email: email.toLowerCase(),
        hashedPassword: password, // Will be hashed by pre-save hook
        fullName: fullName || '',
        isAdmin: true
      });

      await newAdmin.save();
      console.log('\n✓ Admin user created successfully!');
      console.log(`Email: ${newAdmin.email}`);
      console.log(`Admin: ${newAdmin.isAdmin}`);
    }

    rl.close();
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    rl.close();
    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdminUser();
