import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';
import authRoutes from "./routes/auth.js";
import userRoutes from './routes/users.js';
import storeRoutes from './routes/stores.js';
import ratingRoutes from './routes/ratings.js';
import storeOwnerRoutes from './routes/storeOwner.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://storeratingapp-frontend.onrender.com'
  ],
  credentials: true
}));

app.use(express.json());

app.get('/api/auth/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/store-owner', storeOwnerRoutes);
app.use('/api/admin', adminRoutes);


app.use('/api/:any', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    requestedPath: req.originalUrl,
    availableEndpoints: [
      '/api/auth/*',
      '/api/users/*', 
      '/api/stores/*',
      '/api/ratings/*',
      '/api/store-owner/*',
      '/api/admin/*'
    ]
  });
});

const initializeDatabase = async () => {
    const client = await pool.connect();
    try{
        await client.query('BEGIN');

        await client.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400),
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'store_owner')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      await client.query(`CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        address VARCHAR(400) NOT NULL,
        owner_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      await client.query(`CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, store_id)
      )`);

      await client.query('COMMIT');
      console.log("Database tables initialized successfully");
    } catch (error){
        await client.query('ROLLBACK');
        console.error('Database initialization error', error);
    } finally {
        client.release();
    }
};

initializeDatabase();

app.listen(PORT, () =>{
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/auth/health`);
});

export {pool};