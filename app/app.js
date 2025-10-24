// Dependencies
require('dotenv').config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const mongoose = require("mongoose");
const session = require('express-session');
const flash = require('connect-flash');
const allRoutes = require("./routes/allRouters");
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { setUserLocals, isAuthenticated, isAdmin } = require('./middleware/authMiddleware');
const path = require("path");
const livereload = require("livereload");

// Express.js Configuration

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// Flash messages
app.use(flash());

// Make user data and flash messages available to all views
app.use(setUserLocals);

// Auto-reload

const LiveReloadServer = livereload.createServer();
const connectLivereload = require("connect-livereload");

let methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Middleware

// Auth routes (public)
app.use('/auth', authRoutes);

// Account routes (protected)
app.use('/account', accountRoutes);

// Admin routes (protected - admin only)
app.use('/admin', isAdmin, adminRoutes);

// Dashboard route (protected)
const authController = require('./controllers/authController');
app.get('/dashboard', isAuthenticated, authController.auth_get_dashboard);

// Protect all other routes (customer management)
app.use(isAuthenticated);
app.use(allRoutes);

// Server Connection

LiveReloadServer.watch(path.join(__dirname, "public"));
app.use(connectLivereload());
LiveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    LiveReloadServer.refresh("/");
  }, 100);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

// MongoDB Connection
main().catch((error) => console.log(error));
async function main() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log("Connected to database");
}
