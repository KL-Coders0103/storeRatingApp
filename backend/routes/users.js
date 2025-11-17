import express from 'express';
import {authenticatetoken } from '../middleware/auth.js'
import { query } from '../utils/database.js';

const router = express.Router()

router.get('/profile',authenticatetoken,async(req,res)=>{
    try{
        const result = await query(
           'SELECT id, name, email, address, role, created_at FROM users WHERE id = $1', [req.user.id] 
        )

        if(result.rows.length === 0){
            return res.status(404).json({error: "user not found"})
        }

        res.json({user: result.rows[0]})
    } catch(error){
        console.log('get profile error:',error);
        res.status(500).json({error:"Failed to fetch user profile"})
    }
})

export default router