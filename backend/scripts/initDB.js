import pool from '../config/database.js'
import bcrypt from 'bcryptjs'

const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400),
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'store_owner')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        address VARCHAR(400) NOT NULL,
        owner_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, store_id)
      )
    `)

    console.log('✅ Database tables created successfully')

    
    const hashedPassword = await bcrypt.hash('Admin123!', 12)
    
    await pool.query(
      `INSERT INTO users (name, email, password, address, role) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO NOTHING`,
      ['System Administrator', 'admin@ratestore.com', hashedPassword, 'System Headquarters', 'admin']
    )
    
    console.log('✅ Default admin user created')
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  }
}

initDatabase()