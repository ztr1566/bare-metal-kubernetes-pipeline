# Node.js Full-Stack Web Application 🚀

A comprehensive Node.js web application featuring complete authentication system, customer management, and modern web development practices. Built with Express.js, MongoDB, and EJS templating engine.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1.0-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## 🎯 Project Overview

This project demonstrates a **production-ready** Node.js web application with enterprise-level security, scalable architecture, and modern development practices. Perfect for learning full-stack development or as a foundation for larger applications.

## ✨ Key Features

### 🔐 **Complete Authentication System**
- **Secure User Registration & Login** with email validation
- **Password Hashing** using bcrypt with salt factor 10
- **Session Management** with secure HTTP-only cookies
- **Rate Limiting** protection against brute force attacks
- **Flash Messages** for user feedback
- **Protected Routes** with middleware authentication
- **Dashboard** with user account management

### 👥 **Customer Management System**
- **CRUD Operations** (Create, Read, Update, Delete)
- **Search Functionality** for customer records
- **Data Validation** and sanitization
- **Responsive UI** with modern design

### 🔧 **Developer Experience**
- **Live Reload** for instant development feedback
- **Environment Variables** for secure configuration
- **Modern ES6+** JavaScript patterns
- **RESTful API** architecture
- **MVC Pattern** for organized code structure

### 🛡️ **Security Features**
- **Multi-layer Security** architecture
- **Input Validation** on client and server side
- **Password Strength Requirements**
- **Session Security** with expiration
- **Environment-based Configuration**
- **HTTPS-ready** for production deployment

## 🏗️ **Architecture & Technology Stack**

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[EJS Templates] --> B[Bootstrap CSS]
        B --> C[Client-side Validation]
        C --> D[Live Reload]
    end
    
    subgraph "Backend Layer"
        E[Express.js Server] --> F[Authentication Middleware]
        F --> G[Route Handlers]
        G --> H[Controllers]
        H --> I[Business Logic]
    end
    
    subgraph "Data Layer"
        J[Mongoose ODM] --> K[MongoDB Atlas]
        L[Session Store] --> M[User Sessions]
    end
    
    subgraph "Security Layer"
        N[Rate Limiting] --> O[Password Hashing]
        O --> P[Input Validation]
        P --> Q[CSRF Protection]
    end
    
    A --> E
    I --> J
    F --> N
    
    subgraph "Development Tools"
        R[Nodemon] --> S[Live Reload]
        S --> T[Environment Config]
        T --> U[Docker Support]
    end
    
    E --> R
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style J fill:#e8f5e8
    style N fill:#fff3e0
```

## 🛠️ **Technology Stack**

### **Backend Technologies**
- **Node.js** v18+ - JavaScript runtime
- **Express.js** v5.1.0 - Web application framework
- **MongoDB** - NoSQL database with Atlas cloud hosting
- **Mongoose** v8.18.1 - MongoDB object modeling

### **Authentication & Security**
- **bcrypt** v6.0.0 - Password hashing
- **express-session** v1.18.2 - Session management
- **express-rate-limit** v8.1.0 - Rate limiting middleware
- **jsonwebtoken** v9.0.2 - JWT token handling
- **dotenv** v17.2.3 - Environment variable management

### **Frontend Technologies**
- **EJS** v3.1.10 - Embedded JavaScript templating
- **Bootstrap** - Responsive CSS framework
- **JavaScript ES6+** - Modern client-side scripting
- **Live Reload** - Real-time development updates

### **Development Tools**
- **nodemon** v3.1.10 - Auto-restart development server
- **method-override** v3.0.0 - HTTP method override
- **connect-livereload** - Live reload integration
- **multer** v2.0.2 - File upload handling
- **moment.js** v2.30.1 - Date manipulation

### **Additional Features**
- **country-list** v2.4.1 - Country data handling
- **connect-flash** v0.1.1 - Flash messaging
- **Docker Support** - Containerization ready
- **TypeScript Definitions** - Enhanced development experience

## 📁 **Project Structure**

```
node_project/
├── 📄 app.js                    # Main application entry point
├── 📄 package.json              # Dependencies and scripts
├── 📄 .env                      # Environment variables (not committed)
├── 📄 .dockerignore             # Docker ignore rules
├── 📄 .gitignore                # Git ignore rules
│
├── 📁 controllers/              # Business logic controllers
│   ├── 📄 authController.js     # Authentication logic
│   ├── 📄 accountController.js  # Account management
│   └── 📄 customerController.js # Customer operations
│
├── 📁 middleware/               # Custom middleware
│   └── 📄 authMiddleware.js     # Authentication middleware
│
├── 📁 models/                   # Database schemas
│   ├── 📄 userSchema.js         # User model definition
│   └── 📄 customerSchema.js     # Customer model definition
│
├── 📁 routes/                   # Route definitions
│   ├── 📄 authRoutes.js         # Authentication routes
│   ├── 📄 accountRoutes.js      # Account management routes
│   └── 📄 allRouters.js         # Application routes
│
├── 📁 views/                    # EJS templates
│   ├── 📁 auth/                 # Authentication pages
│   │   ├── 📄 login.ejs         # Login page
│   │   ├── 📄 register.ejs      # Registration page
│   │   └── 📄 dashboard.ejs     # User dashboard
│   ├── 📁 components/           # Reusable components
│   └── 📁 user/                 # User management views
│
└── 📁 public/                   # Static assets
    ├── 📁 css/                  # Stylesheets
    ├── 📁 js/                   # Client-side JavaScript
    └── 📁 images/               # Image assets
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js v18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git for version control

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/ztr1566/node_project.git
   cd node_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Configure environment variables**
   ```env
   PORT=3001
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   SESSION_SECRET=your-super-secret-session-key
   JWT_SECRET=your-jwt-secret-key
   NODE_ENV=development
   ```

5. **Start the application**
   ```bash
   # Development mode with auto-reload
   npm run watch
   
   # Production mode
   npm start
   ```

6. **Access the application**
   ```
   🌐 Application: http://localhost:3001
   🔐 Login: http://localhost:3001/auth/login
   📝 Register: http://localhost:3001/auth/register
   📊 Dashboard: http://localhost:3001/dashboard
   ```

## 🔧 **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm start` | Start the application in production mode |
| `npm run watch` | Start with nodemon for development (auto-reload) |

## 🔐 **Security Implementation**

### **Multi-Layer Security Architecture**

```mermaid
graph TD
    A[User Request] --> B[Rate Limiting]
    B --> C[Input Validation]
    C --> D[Authentication Check]
    D --> E[Session Validation]
    E --> F[Route Authorization]
    F --> G[Data Processing]
    G --> H[Response]
    
    subgraph "Security Layers"
        B
        C
        D
        E
        F
    end
    
    style B fill:#ffcdd2
    style C fill:#f8bbd9
    style D fill:#e1bee7
    style E fill:#c5cae9
    style F fill:#bbdefb
```

### **Security Features Implementation**

- **🔒 Password Security**
  - Bcrypt hashing with salt factor 10
  - Minimum 8 characters with complexity requirements
  - No plain text password storage

- **🛡️ Session Security**
  - HTTP-only cookies
  - Secure flag for HTTPS
  - 7-day session expiration
  - Session regeneration on login

- **⚡ Rate Limiting**
  - Login attempts: 5 per 15 minutes
  - Registration: 3 per hour
  - Prevents brute force attacks

- **✅ Input Validation**
  - Client-side real-time validation
  - Server-side validation
  - Data sanitization
  - SQL injection prevention

## 📊 **API Endpoints**

### **Authentication Routes**
| Method | Endpoint | Description | Protection |
|--------|----------|-------------|------------|
| GET | `/auth/login` | Display login page | Public |
| POST | `/auth/login` | Process login | Rate Limited |
| GET | `/auth/register` | Display registration page | Public |
| POST | `/auth/register` | Process registration | Rate Limited |
| GET | `/auth/logout` | Logout user | Protected |

### **Application Routes**
| Method | Endpoint | Description | Protection |
|--------|----------|-------------|------------|
| GET | `/dashboard` | User dashboard | Protected |
| GET | `/` | Home page | Public |
| GET | `/user/add.html` | Add customer form | Protected |
| POST | `/user/add.html` | Create customer | Protected |
| GET | `/search` | Search customers | Protected |
| GET | `/edit/:id` | Edit customer form | Protected |
| PUT | `/edit/:id` | Update customer | Protected |
| DELETE | `/edit/:id` | Delete customer | Protected |

## 🎨 **User Interface Features**

- **🎯 Responsive Design** - Works on all device sizes
- **💫 Modern UI** - Clean, professional interface
- **⚡ Real-time Validation** - Instant feedback on forms
- **🔔 Flash Messages** - User-friendly notifications
- **🔐 Password Strength Indicator** - Visual password requirements
- **📱 Mobile-First** - Optimized for mobile devices

## 🧪 **Testing & Quality Assurance**

### **Security Testing**
- Rate limiting verification
- Authentication bypass testing
- Input validation testing
- Session security verification

### **Functionality Testing**
- User registration flow
- Login/logout functionality
- Customer CRUD operations
- Search functionality

## 🚀 **Deployment Options**

### **Heroku Deployment**
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set SESSION_SECRET=your_session_secret
git push heroku main
```

### **Docker Deployment**
```bash
docker build -t node_project .
docker run -p 3001:3001 --env-file .env node_project
```

### **AWS/DigitalOcean**
- Set up Ubuntu server
- Install Node.js and PM2
- Configure nginx reverse proxy
- Set up SSL with Let's Encrypt

## 📚 **Documentation**

- **[📖 Authentication Guide](AUTH_README.md)** - Detailed authentication documentation
- **[⚡ Quick Start Guide](QUICK_START.md)** - Fast setup instructions
- **[🏗️ Project Structure](PROJECT_STRUCTURE.md)** - Detailed architecture overview
- **[🔧 Setup Complete Guide](SETUP_COMPLETE.md)** - Complete setup walkthrough
- **[👀 Visual Guide](VISUAL_GUIDE.md)** - Screenshots and visual documentation
- **[🏢 Multi-Tenant Features](MULTI_TENANT_UPDATE.md)** - Multi-tenancy implementation

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Express.js** community for the robust framework
- **MongoDB** for the flexible database solution
- **Bootstrap** for the responsive UI components
- **Node.js** community for continuous innovation

## 📞 **Support & Contact**

- **🐛 Issues**: [GitHub Issues](https://github.com/ztr1566/node_project/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/ztr1566/node_project/discussions)
- **📧 Email**: [Contact Developer](mailto:your-email@example.com)

---

<div align="center">

**⭐ Star this repository if you found it helpful! ⭐**

**Built with ❤️ using Node.js and modern web technologies**

[![GitHub stars](https://img.shields.io/github/stars/ztr1566/node_project?style=social)](https://github.com/ztr1566/node_project/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ztr1566/node_project?style=social)](https://github.com/ztr1566/node_project/network/members)

</div>