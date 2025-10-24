# 🚀 Quick Start Guide

## Step 1: Update Environment Variables (2 minutes)

Open `.env` file and update these two secrets:

```env
SESSION_SECRET=your-random-secret-here
JWT_SECRET=your-random-jwt-secret-here
```

### Generate Secure Secrets

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option 2: Using PowerShell**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

**Option 3: Use these example secrets (for testing only)**
```env
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_SECRET=z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1
```

## Step 2: Start the Server (30 seconds)

```bash
npm start
```

You should see:
```
http://localhost:3001
Connected to database
```

## Step 3: Test Registration (1 minute)

1. Open browser: **http://localhost:3001/auth/register**

2. Fill in the form:
   - **Email:** `test@example.com`
   - **Password:** `Test@123456` (or any password that meets requirements)
   - **Confirm Password:** `Test@123456`

3. Click **Register**

4. You should see: ✅ "Registration successful! Please log in."

## Step 4: Test Login (30 seconds)

1. You'll be redirected to: **http://localhost:3001/auth/login**

2. Enter your credentials:
   - **Email:** `test@example.com`
   - **Password:** `Test@123456`

3. Click **Login**

4. You should be redirected to: **http://localhost:3001/dashboard**

## Step 5: Verify Dashboard (30 seconds)

You should see:
- ✅ Welcome message
- ✅ Your email address
- ✅ Account creation date
- ✅ Quick links to other pages

## Step 6: Test Protected Route (30 seconds)

1. Open a new private/incognito browser window

2. Try to access: **http://localhost:3001/dashboard**

3. You should be redirected to login page with message:
   - ❌ "Please log in to access this page"

## Step 7: Test Logout (15 seconds)

1. Go back to your logged-in browser

2. Click **Logout** or visit: **http://localhost:3001/auth/logout**

3. You should be redirected to login page

4. Try accessing dashboard again - you should be redirected to login

## ✅ Success Checklist

- [ ] Environment variables updated
- [ ] Server starts without errors
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Dashboard displays user information
- [ ] Protected routes redirect to login when not authenticated
- [ ] Logout works correctly

## 🎯 Test Scenarios

### Test 1: Password Validation
Try registering with weak passwords:
- ❌ `test` - Too short
- ❌ `testtest` - No uppercase, number, or special char
- ❌ `Testtest` - No number or special char
- ❌ `Testtest1` - No special char
- ✅ `Testtest1!` - Valid!

### Test 2: Email Validation
Try registering with invalid emails:
- ❌ `notanemail` - Invalid format
- ❌ `test@` - Incomplete
- ❌ `@example.com` - Missing username
- ✅ `test@example.com` - Valid!

### Test 3: Duplicate Registration
Try registering with the same email twice:
- First time: ✅ Success
- Second time: ❌ "An account with this email already exists"

### Test 4: Wrong Password
Try logging in with wrong password:
- ❌ "Invalid email or password"

### Test 5: Rate Limiting
Try logging in with wrong password 6 times:
- First 5 attempts: ❌ "Invalid email or password"
- 6th attempt: ❌ "Too many login attempts. Please try again after 15 minutes."

## 🐛 Troubleshooting

### Problem: Server won't start

**Error:** `Port 3001 is already in use`

**Solution:**
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Problem: Can't connect to MongoDB

**Error:** `MongooseServerSelectionError`

**Solution:**
1. Check your `MONGODB_URI` in `.env`
2. Ensure your IP is whitelisted in MongoDB Atlas
3. Test internet connectivity

### Problem: Session not persisting

**Symptoms:** Logged out after page refresh

**Solution:**
1. Clear browser cookies
2. Check `SESSION_SECRET` is set in `.env`
3. Restart the server
4. Try a different browser

### Problem: Flash messages not showing

**Solution:**
1. Ensure you're using the correct EJS syntax
2. Check that `connect-flash` is installed
3. Verify `setUserLocals` middleware is active

## 📱 Test on Different Devices

### Desktop Browser
- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ✅ Safari

### Mobile Browser
- ✅ Chrome Mobile
- ✅ Safari iOS
- ✅ Samsung Internet

### Responsive Design
- ✅ Desktop (1920x1080)
- ✅ Laptop (1366x768)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

## 🔗 Quick Links

| Page | URL | Auth Required |
|------|-----|---------------|
| Home | http://localhost:3001/ | No |
| Login | http://localhost:3001/auth/login | No |
| Register | http://localhost:3001/auth/register | No |
| Dashboard | http://localhost:3001/dashboard | Yes |
| Logout | http://localhost:3001/auth/logout | Yes |

## 💡 Tips

1. **Use Chrome DevTools** to inspect network requests and cookies
2. **Check Console** for any JavaScript errors
3. **Monitor Terminal** for server-side errors
4. **Use Incognito Mode** to test without cached sessions
5. **Test Rate Limiting** in a separate browser to avoid lockout

## 🎉 Next Steps

Once everything works:

1. ✅ Update secrets in `.env` to secure random values
2. ✅ Test all scenarios above
3. ✅ Integrate authentication into your existing pages
4. ✅ Add authentication to routes that need protection
5. ✅ Customize the UI to match your brand
6. ✅ Add additional features (email verification, password reset, etc.)

## 📚 Documentation

For more details, see:
- **SETUP_COMPLETE.md** - Complete setup guide
- **AUTH_README.md** - Detailed authentication documentation
- **PROJECT_STRUCTURE.md** - File structure and architecture

---

**Total Setup Time:** ~5 minutes
**Total Test Time:** ~3 minutes

🎊 **Congratulations! Your authentication system is ready!**
