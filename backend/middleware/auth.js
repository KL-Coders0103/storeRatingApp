import jwt from 'jsonwebtoken';
import {query} from '../utils/database.js';

export const authenticatetoken = async(req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({error:"access token required"});
    }

    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        const userResult = await query(
            'SELECT id, name, email, role FROM users WHERE id = $1',
            [decoded.userId]
        );

        if(userResult.rows.length===0){
            return res.status(403).json({error: "Invalid token"});
        }

        req.user = userResult.rows[0];
        next();
    } catch (error){
        return res.status(403).json({error: "invalid or expired token"});
    }
};

export const requiredRole = (roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({error: "insufficient permissions"});
        }
        next();
    };
};