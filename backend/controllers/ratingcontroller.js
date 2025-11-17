import { query } from "../utils/database.js";

export const submitRating = async (req, res)=> {
    const {storeId, rating} = req.body;
    const userId = req.user.id;

    if(rating < 1 || rating > 5){
        return res.status(400).json({error: 'rating must be between 1 and 5'});
    }

    try{
        const storeCheck = await query('SELECT id FROM stores WHERE id = $1', [storeId]);

        if(storeCheck.rows.length === 0 ){
            return res.status(404).json({error: 'Store not found'});
        }

        const result = await query(`
            INSERT INTO ratings (user_id, store_id, rating) 
            VALUES ($1, $2, $3) 
            ON CONFLICT (user_id, store_id) 
            DO UPDATE SET rating = $3, updated_at = CURRENT_TIMESTAMP
            RETURNING *`,
            [userId, storeId, rating]);

            res.json({
                Message: 'Rating submitted successfully',
                rating: result.rows[0]
            });
    } catch (error) {
        console.log("submit rating error: ", error);
        res.status(500).json({error: 'Failed to submit rating'});
    }
};

export const getUserRating = async(req,res) => {
    const {storeId} = req.params;
    const userId = req.user.id;

    try{
        const result = await query(
            'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2',
            [userId, storeId]
        );

        res.json({rating: result.rows[0] || null});
    } catch (error){
        console.log("Get user Rating error: ",error);
        res.status(500).json({error: 'Failed to fetch user rating'});
    }
};