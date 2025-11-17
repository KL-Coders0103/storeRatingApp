import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../utils/database.js';

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET || 'fallback-secret', {
        expiresIn: '24h'
    });
};

export const register = async (req, res) => {
  console.log('Registration request body:', req.body);
  
  const { name, email, password, address, role, storeName, storeEmail, storeAddress } = req.body;

  try {
    if (!name || !email || !password || !address) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userResult = await query(
      `INSERT INTO users (name, email, password, address, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, address, role, created_at`,
      [name, email, hashedPassword, address, role || 'user']
    );

    const user = userResult.rows[0];

    if (role === 'store_owner' && storeName && storeEmail && storeAddress) {
      console.log('Creating store for store owner');

      const existingStore = await query('SELECT id FROM stores WHERE email = $1', [storeEmail]);
      if (existingStore.rows.length > 0) {
        return res.status(409).json({ error: 'Store with this email already exists' });
      }

      await query(
        `INSERT INTO stores (name, email, address, owner_id) 
         VALUES ($1, $2, $3, $4)`,
        [storeName, storeEmail, storeAddress, user.id]
      );
    }

    const token = generateToken(user.id);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: user,
      token
    });

  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

export const login = async(req, res) => {
    const {email,password} = req.body;

    try{
        const result = await query(
            'SELECT id, name, email, password, role FROM users WHERE email = $1',
            [email]
        );

        if(result.rows.length === 0 ){
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({error: 'Invalid Password'});
        }

        const token = generateToken(user.id);

        res.json({
            message: "Login succesffully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address
            },
            token
        });
    } catch (error){
        console.log("Login error:",error);
        res.status(500).json({error: 'Internal server error during login'});
    }
};

export const updatePassword = async (req, res) => {
    const {currentPassword, newPassword} = req.body;
    const userId = req.user.id;
    
    try{
        const userResult = await query('SELECT password FROM users WHERE id = $1',[userId]);

        if(userResult.rows.length === 0){
            return res.status(404).json({error: "User not found"});
        }

        const isCurrentPasswordValid = await bcrypt.compare(
            currentPassword,
            userResult.rows[0].password
        );

        if(!isCurrentPasswordValid){
            return res.status(401).json({error: 'Current password is incorrect'});
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        await query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',[hashedNewPassword, userId]);
    
        res.json({message: 'Password updated successfully'});
    } catch(error){
        console.log('Password update error:', error);
        res.status(500).json({error: 'Internal server error dusrin password update'});
    }
};