# Admin Dashboard Setup Guide

This guide explains how to set up and use the admin dashboard functionality.

## Features

The admin dashboard provides the following features:

1. **User Management**
   - View all registered users
   - Toggle admin status for users
   - Delete users (and their associated customers)
   - View user profile information

2. **Customer Management**
   - View all customers across all users
   - Delete customers
   - View customer details and ownership

3. **Database Statistics**
   - View total users, customers, and admins
   - See customer distribution by gender
   - View top 10 countries by customer count
   - Visual charts and statistics

## Creating a Root Admin Account

To create your first admin account, run the following command:

```bash
npm run create-admin
```

This will prompt you to enter:
- Admin email address
- Password (must meet security requirements)
- Full name (optional)

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

## Accessing the Admin Dashboard

1. Log in with your admin account
2. Once logged in, you'll see additional menu items in the sidebar:
   - **Admin Dashboard** - Overview and statistics
   - **Manage Users** - User management interface
   - **Manage Customers** - Customer management interface
   - **Statistics** - Detailed database statistics

## Admin Permissions

Admin users have the following permissions:
- Access to all admin routes (`/admin/*`)
- View all users and customers in the system
- Modify user admin status
- Delete users and customers
- View detailed statistics

**Note:** Admins cannot:
- Remove their own admin status
- Delete their own account

## Security Considerations

1. **Admin Access Control**: All admin routes are protected by the `isAdmin` middleware
2. **Session-Based**: Admin status is verified on every request
3. **Self-Protection**: Admins cannot modify or delete their own accounts to prevent lockouts

## Troubleshooting

### Cannot access admin dashboard
- Ensure you're logged in with an admin account
- Check that the user's `isAdmin` field is set to `true` in the database

### Creating admin manually in database
If you need to manually set a user as admin in MongoDB:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isAdmin: true } }
)
```

## Profile Image Issue Fix

The profile image display issue across devices has been addressed. The system now:
- Stores profile images in the database with their paths
- Fetches user data (including profile photo) on every request via the `setUserLocals` middleware
- Ensures profile images are displayed consistently across all devices accessing the same server

**Note:** Profile images are stored in the `public/uploads/` folder. If you're deploying across multiple servers, consider using a shared storage solution (e.g., AWS S3, Azure Blob Storage) for profile images.
