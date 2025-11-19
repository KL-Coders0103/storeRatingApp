# RateStore - Store Rating Platform

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-blue?style=for-the-badge)
![EJS](https://img.shields.io/badge/EJS-blue?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-blue?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-blue?style=for-the-badge)
![CSS3](https://img.shields.io/badge/CSS3-blue?style=for-the-badge)
![dotenv](https://img.shields.io/badge/dotenv-blue?style=for-the-badge)
![CSS](https://img.shields.io/badge/CSS-blue?style=for-the-badge)
[![GitHub stars](https://img.shields.io/github/stars/todo-app-mongodb?style=social)](https://github.com/todo-app-mongodb/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/todo-app-mongodb?style=social)](https://github.com/todo-app-mongodb/network/members)
[![License: Not specified](https://img.shields.io/badge/License-Not%20specified-lightgrey.svg)](LICENSE)


## Table of Contents

- [📖 Table of Contents](#-table-of-contents)
- [💡 Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#-technology-stack)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Installation & Setup](#-installation-setup)
- [🎬 Usage Examples](#-usage-examples)
- [🔗 API Documentation](#-api-documentation)
- [📂 Project Structure](#-project-structure)
- [🛡️ Security features](#-security-features)
- [☁️ Deployment](#-deployment)
- [🤝 Support & Troubleshooting](#-support-troubleshooting)


---


## 💡 Project Overview

`RateStore` is a comprehensive full-stack web application that enables users to discover, rate, and review stores. The platform supports three distinct user roles with specialized functionalities for each, creating a complete ecosystem for store ratings and management.

[Live Demo](https://storeratingapp-frontend.onrender.com/)

---

## ✨ Key Features

*   **🔐 Authentication & Security**
    * Secure User Registration with comprehensive form validation
    * JWT-based Authentication with protected routes
    * Password Validation (8-16 chars, uppercase, special characters)
    * Role-based Access Control (RBAC)

*   **🎨 User Experience**
    * Glass Morphism UI Design with modern aesthetics
    * Responsive Design for all device sizes
    * Smooth Animations using Framer Motion
    * Professional Color Scheme (Purple/Blue gradient theme)
    * Real-time Search & Filtering

*   **📊 Advanced Functionality**
    * Store Rating System (1-5 stars with visual feedback)
    * Rating Analytics & Distribution for store owners
    * Advanced Search & Sorting across all listings
    * Pagination for large datasets
    * Admin Dashboard with platform statistics

## 👥 User Roles

*   **👤 Normal Users**
    * Browse Stores with search and filtering capabilities
    * Rate Stores (1-5 stars) and modify existing ratings
    * User Profile Management with password updates
    * Store Discovery with advanced search options

*   **🏪 Store Owners**
    * Store Management Dashboard with performance metrics
    * Rating Analytics with visual distribution charts
    * Customer Insights - view who rated and when
    * Performance Tracking with average ratings and trends

*   **👨‍💼 Administrators**
    * Platform Overview with total users, stores, and ratings
    * User Management - create, update, and manage user roles
    * Store Management - create stores and assign owners
    * Advanced Filtering across all platform data
    Role Management (user, store_owner, admin)


---

## 🛠️ Technology Stack

This project leverages a modern and efficient technology stack to deliver a robust full-stack web application:

*   **Frontend**
    * React 18 with Hooks and Context API
    * Vite - Next-generation frontend tooling
    * Tailwind CSS - Utility-first CSS framework
    * Framer Motion - Production-ready motion library
    * Lucide React - Beautiful & consistent icons
    * Axios - Promise-based HTTP client
    * React Router DOM - Declarative routing

*   **Backend**
    * Node.js - JavaScript runtime environment
    * Express.js - Fast, unopinionated web framework
    * PostgreSQL - Powerful, open-source object-relational database
    * bcryptjs - Optimized bcrypt in JavaScript
    * JSON Web Tokens - Secure token-based authentication
    * CORS - Express middleware for CORS
    * Express Validator - Request validation middleware

*   **Deployment**
    * Render - Unified cloud for full-stack applications
    * PostgreSQL - Managed database on Render

---

## 🚀 Quick Start

Get `RateStore` running on your local machine in under 5 minutes!

**Prerequisites:**

Before you begin, ensure you have the following installed:

*   **Node.js:** (LTS version recommended) [Download & Install](https://nodejs.org/en/download/)
*   **npm:** (Node Package Manager) Comes bundled with Node.js.
*   **PostgreSQL** [Download & Install](https://www.postgresql.org/download/)

**Steps:**

1.  **Clone the repository:**
```bash
git clone <repository-url>
cd store-rating-platform
```
(Replace `` with the actual URL of this GitHub repository.)

2.  **Backend Setup:**
```bash
cd backend
npm install
```

3.  **Frontend Setup:**
```bash
cd frontend
npm install
```

4.  **Create a `.env` file:**
In the root directory of your project, create a new file named `.env`.
```bash
# Backend .env
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=store_rating
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your-jwt-secret-key
PORT=5000

# Frontend .env
VITE_API_URL=http://localhost:5000/api
```

5.  **Start Development Servers:**
```bash
# Backend (Terminal 1)
cd backend && npm run dev

# Frontend (Terminal 2)  
cd frontend && npm run dev
```

7.  **Access the application:**
Open your web browser and navigate to:
```bash
Frontend: http://localhost:3000
Backend API: http://localhost:5000/api
```
You should now see the RateStore application running!

---

## ⚙️ Installation & Setup

This section provides more detailed instructions for setting up the `RateStore` project.

### 1. Database Configuration

**PostgreSQL Setup:**
```sql
-- Database initialization
CREATE DATABASE store_rating;

-- Tables are automatically created by the application
-- Users, Stores, and Ratings tables with proper relationships
```

### 2. Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
DB_USER=postgres
DB_HOST=localhost
DB_NAME=store_rating
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your-super-secure-jwt-secret
PORT=5000
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🎬 Usage Examples

The `todo-app-mongodb` provides a straightforward user interface for managing your tasks. Here's how you can interact with the application:

### 1. User Registration & Store Rating

```javascript
// Example: User rates a store
const ratingData = {
storeId: 1,
rating: 5  // 1-5 stars
};

// API Call
await ratingsAPI.post('/ratings', ratingData);
```

### 2. Store Owner Dashboard

Store owners can view:
* Average Rating and total ratings
* Rating Distribution (1-5 stars)
* Recent Customer Ratings
* Performance Insights

### 3. Admin User Management

```javascript
// Example: Admin creates a new store owner
const userData = {
name: 'Store Owner Name',
email: 'owner@store.com',
password: 'SecurePass123!',
address: 'Store Address',
role: 'store_owner'
};

await adminAPI.post('/admin/users', userData);
```
    
---

## 🔗 API Documentation

This application exposes a set of RESTful API endpoints primarily for its own server-side rendering, but they can be understood as core functionalities. All endpoints handle task management (CRUD operations).

**Base URL:** `http://localhost:5000` (or your deployed URL)

### 1. Authentication Endpoints

*   `POST /api/auth/register` - User registration
*   `POST /api/auth/login` - User authentication
*   `PUT /api/auth/password` - Password update

### 2. Store Endpoints

* `GET /api/stores` - Get stores with search/filter
* `GET /api/stores/:id` - Get store details
* `POST /api/stores` - Create store (store owners)

### 3. Rating Endpoints

* `POST /api/ratings` - Submit store rating
* `GET /api/ratings/store/:storeId` - Get user's rating

### 4. Store Owner Endpoints

* `GET /api/store-owner/dashboard` - Store analytics
* `GET /api/store-owner/ratings` - Store ratings with pagination

### 5. Admin Endpoints

* `GET /api/admin/dashboard` - Platform overview
* `GET /api/admin/users` - User management
* `POST /api/admin/users` - Create users
* `GET /api/admin/stores` - Store management
* `POST /api/admin/stores` - Create stores
* `PUT /api/admin/users/:userId/role` - Update user roles


---

## 📂 Project Structure

The `Store-Rating` project adheres to a clear and logical directory structure for enhanced clarity and maintainability:

```
store-rating-platform/
├── backend/
│   ├── config/
│   │   └── database.js      # Database configuration
│   ├── controllers/         # Route controllers
│   │   ├── authController.js
│   │   ├── storeController.js
│   │   ├── ratingController.js
│   │   └── adminController.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/             # Database models
│   │   ├── User.js
│   │   ├── Store.js
│   │   └── Rating.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── stores.js
│   │   ├── ratings.js
│   │   └── admin.js
│   └── server.js           # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── RatingStars.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── contexts/       # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Stores.jsx
│   │   │   └── Admin*.jsx
│   │   ├── services/       # API services
│   │   │   └── api.js
│   │   └── App.jsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json
└── README.md

```

---

## 🔒 Security Features

*   **Authentication & Authorization**
    * JWT-based authentication with secure token storage
    * Role-based access control for all routes
    * Password hashing using bcryptjs with salt rounds

* **Data Validation**
    * Input sanitization on all user inputs
    * SQL injection prevention with parameterized queries
    * Form validation with comprehensive rules

* **Security Headers**
    * CORS configuration for cross-origin requests
    * Helmet.js for security headers (recommended for production)
    * Rate limiting implementation (recommended)

---

## 🌐 Deployment

### Render Deployment

**Backend Service:**

* Runtime: Node.js
* Build Command: `npm install`
* Start Command: `npm start`
* Environment Variables:
    * `DATABASE_URL`
    * `JWT_SECRET`
    * `NODE_ENV=production`

**Frontend Static Site:**

* Build Command: `npm run build`
* Publish Directory: `dist`
* Environment Variables:
    * VITE_API_URL=https://your-backend.onrender.com/api

**PostgreSQL Database:**

* Managed PostgreSQL on Render
* Automatic connection string configuration

### Production Environment Variables

```env
# Backend
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production

# Frontend  
VITE_API_URL=https://your-backend.onrender.com/api
```
---

## 📞 Support & Troubleshooting

### Common Issues

**Database Connection Issues:**
```bash
# Check database connection
psql -h host -U username -d database_name

# Test backend connection
curl https://your-backend.onrender.com/api/health
```

**Frontend Build Issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Build production version
npm run build
```

### Getting Help
1. Check Application Logs in Render dashboard
2. Verify Environment Variables are correctly set
3. Test API Endpoints directly using curl or Postman
4. Check Browser Console for frontend errors

### Performance Optimization

* Database indexing on frequently queried fields
* Query optimization for large datasets
* Frontend code splitting for better load times
* Image optimization and lazy loading

---

`RateStore` - Your complete solution for store discovery and ratings management! Built with modern technologies and best practices. 🚀