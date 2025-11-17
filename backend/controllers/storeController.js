import { query } from "../utils/database.js";

export const getStores = async (req,res) =>{
    const {search, sortBy = 'name', sortOrder='asc'} = req.query;
    const userId = req.user?.id;

    try{
        let whereClause = '';
        const queryParams = [];

        if(search){
            whereClause = `WHERE s.name ILIKE $1 OR s.address ILIKE $1`;
            queryParams.push(`%${search}%`);
        }

        const validSortColumns = ['name', 'address', 'created-at'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy :'name';
        const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

        const storesQuery = `
        SELECT 
        s.id,
        s.name,
        s.email,
        s.address,
        s.created_at,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.rating) as total_ratings,
        ur.rating as user_rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $${queryParams.length + 1}
        ${whereClause}
        GROUP BY s.id, s.name, s.email, s.address, s.created_at, ur.rating
        ORDER BY ${sortColumn} ${order}`;

        const result = await query(storesQuery, [...queryParams, userId]);

        res.json({stores: result.rows});
    } catch (error) {
        console.log('Get Stores error:', error);
        res.status(500).json({error: 'Failed to fetch stores'});
    }
};

export const getStoresById = async (req, res) => {
    const {id} =req.params;

    try{
        const result = await query(`SELECT 
        s.*,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.rating) as total_ratings
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE s.id = $1
        GROUP BY s.id`,
        [id]);
        
        if(result.rows.length === 0){
            return res.status(404).json({error: 'Store not Found'});
        }

        res.status({store: result.rows[0] });
    } catch (error) {
        console.log('Get store error:',error);
        res.statuc(500).json({error: 'Failed to fetch store'});
    }
};

export const createStore = async (req,res) => {
    const {name, email, address} = req.body;
    const ownerId = req.user.id;

    if(req.user.role !== 'store_owner') {
        return res.status(403).json({
            error: 'Only store owners can create stores'
        });
    }

    try {
        const existingStore = await query('SELECT id FROM stores WHERE email = $1',[email]);

        if(existingStore.rows.length > 0){
            return res.status(409).json({
                error: 'Store with this enmail already exists'
            });
        }

        const result = await query(
            `INSERT INTO stores (name, email, address, owner_id) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, name, email, address, owner_id, created_at`,
            [name, email, address, ownerId]
        );

        res.status(201).json({
            message: 'Store created successfully',
            store: result.rows[0]
        }); 
    } catch (error) {
        console.error("create store error:",error);
        res.status(500).json({
            error: 'Failed to create store'
        })
    }
}