import {pool} from '../server.js';

export const query = async(text, params) => {
    const client = await pool.connect();
    try{
        const result = await client.query(text,params);
        return result;
    } finally {
        client.release();
    }
};