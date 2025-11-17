import {query} from '../utils/database.js'

export const getStoreOwnerDashboard = async (req, res) => {
    const ownerId = req.user.id 
    try {
        const storeResult = await query(
          `SELECT 
            s.id,
            s.name,
            s.email,
            s.address,
            COALESCE(AVG(r.rating), 0) as average_rating,
            COUNT(r.rating) as total_ratings
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.owner_id = $1
            GROUP BY s.id, s.name, s.email, s.address`,[ownerId]  
        )

        if(storeResult.rows.length === 0) {
            return res.status(404).json({error: 'No store found for this owner'})
        }

        const store = storeResult.rows[0];

        const ratingsResult = await query(
            `SELECT 
            r.rating,
            r.created_at,
            u.name as user_name,
            u.email as user_email
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = $1
            ORDER BY r.created_at DESC
            LIMIT 10`,[store.id]
        )

        const distributionResult = await query(
           `SELECT 
            rating,
            COUNT(*) as count
            FROM ratings 
            WHERE store_id = $1
            GROUP BY rating
            ORDER BY rating DESC`,
            [store.id] 
        )

        const ratingDistribution = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        }

        distributionResult.rows.forEach(row => {
            ratingDistribution[row.rating] = parseInt(row.count)
        })

        res.json({
            store: {
                ...store,
                average_rating: parseFloat(store.average_rating).toFixed(1)
            },
            recentRatings: ratingsResult.rows,
            ratingDistribution,
            stats: {
                totalRatings: parseInt(store.total_ratings),
                averageRating: parseFloat(store.average_rating).toFixed(1)
            }
        })
    } catch (error) {
        console.error('Store owner dashboard error', error)
        res.status(500).json({
            error: 'Failed to fetch store owner dashboard'
        })
    }
}

export const getStoreRatings = async (req,res) => {
    const ownerId = req.user.id
    const {
        page =1,
        limit=10,
        sortBy='created_at',
        sortOrder='desc'
    } = req.query

    try{
        const offset = (page-1)*limit;
        const storeResult = await query(
            'SELECT id FROM stores WHERE owner_id = $1', [ownerId]
        )

        if(storeResult.rows.length === 0){
            return res.status(404).json({
                error: 'no store found for this owner'
            })
        }

        const storeId = storeResult.rows[0].id

        const ratingsResult = await query(
            `SELECT 
            r.rating,
            r.created_at,
            u.name as user_name,
            u.email as user_email,
            u.address as user_address
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = $1
            ORDER BY ${sortBy} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}
            LIMIT $2 OFFSET $3`,
            [storeId, limit, offset]
        )

        const countResult = await query(
            'SELECT COUNT(*) FROM ratings WHERE store_id = $1', [storeId]
        )

        const totalRatings = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalRatings / limit);

        res.json({
            ratings: ratingsResult.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalRatings,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        })
    } catch (error) {
        console.error('Get store ratings error:', error)
        res.status(500).json({
            error: 'Failed to fetch store ratings'
        })
    }
}