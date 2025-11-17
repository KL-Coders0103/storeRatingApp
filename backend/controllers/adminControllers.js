import { query } from '../utils/database.js';
import bcrypt from 'bcryptjs';

export const getAdminDashboard = async (req, res) => {
    try{
        const usersCount = await query('SELECT COUNT(*) FROM users');
        const storesCount = await query('SELECT COUNT(*) FROM stores');
        const ratingsCount = await query('SELECT COUNT(*) FROM ratings');

        const recentUsers = await query(
            `SELECT id, name, email, role, created_at 
            FROM users 
            ORDER BY created_at DESC 
            LIMIT 5`
        );

        const recentStores = await query(
            `SELECT s.id, s.name, s.email, s.address, u.name as owner_name, s.created_at
            FROM stores s
            LEFT JOIN users u ON s.owner_id = u.id
            ORDER BY s.created_at DESC 
            LIMIT 5`
        );

        res.json({
            stats: {
                totalUsers: parseInt(usersCount.rows[0].count),
                totalStores: parseInt(storesCount.rows[0].count),
                totalRatings: parseInt(ratingsCount.rows[0].count)
            },
            recentUsers: recentUsers.rows,
            recentStores: recentStores.rows
        });
    } catch (error ){
        console.error("Admin Dashboard error:", error);
        res.status(500).json({error: 'Failed to fetch admin dashboard data'})
    }
}

export const getUsers = async (req,res) => {
    const {search, role, sortBy='name', sortOrder='asc', page=1, limit=10} = req.query;

    try{
        let whereConditions =[];
        const queryParams = [];
        let paramCount =0;

        if(search){
            paramCount++
            whereConditions.push(`role = $${paramCount}`)
            queryParams.push(role)
        }

        const whereClause = whereConditions.length > 0 ?
        `WHERE ${whereConditions.join(' AND ')}` : '';

        const validSortColumns = ['name', 'email', 'role', 'created_at']
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
        const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

        const offset = (page - 1 ) * limit;

        const usersResult = await query(
            `SELECT id, name, email, address, role, created_at
            FROM users 
            ${whereClause}
            ORDER BY ${sortColumn} ${order}
            LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
            [...queryParams, limit, offset]
        );

        const countResult = await query(
            `SELECT COUNT(*) FROM users ${whereClause}`,queryParams
        );

        const totalUsers = parseInt(countResult.rows[0].count)
        const totalPages = Math.ceil(totalUsers / limit)

        res.json({
            users: usersResult.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalUsers,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        })
    } catch (error){
        console.error("Get users error:", error)
        res.status(500).json({
            error: "Failed to fetch users"
        })
    }
}

export const getStores = async (req, res) => {
  const { search, sortBy = 'name', sortOrder = 'asc', page = 1, limit = 10 } = req.query

  try {
    let whereConditions = []
    const queryParams = []
    let paramCount = 0

    if (search) {
      paramCount++
      whereConditions.push(`(s.name ILIKE $${paramCount} OR s.email ILIKE $${paramCount} OR s.address ILIKE $${paramCount} OR u.name ILIKE $${paramCount})`)
      queryParams.push(`%${search}%`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    const validSortColumns = ['s.name', 's.email', 'average_rating', 's.created_at']
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 's.name'
    const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC'

    const offset = (page - 1) * limit

    const storesResult = await query(
      `SELECT 
        s.id,
        s.name,
        s.email,
        s.address,
        s.created_at,
        u.name as owner_name,
        u.id as owner_id,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.rating) as total_ratings
       FROM stores s
       LEFT JOIN users u ON s.owner_id = u.id
       LEFT JOIN ratings r ON s.id = r.store_id
       ${whereClause}
       GROUP BY s.id, s.name, s.email, s.address, s.created_at, u.name, u.id
       ORDER BY ${sortColumn} ${order}
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...queryParams, limit, offset]
    )

    const countResult = await query(
      `SELECT COUNT(DISTINCT s.id) FROM stores s LEFT JOIN users u ON s.owner_id = u.id ${whereClause}`,
      queryParams
    )

    const totalStores = parseInt(countResult.rows[0].count)
    const totalPages = Math.ceil(totalStores / limit)

    res.json({
      stores: storesResult.rows.map(store => ({
        ...store,
        average_rating: parseFloat(store.average_rating).toFixed(1)
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalStores,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get stores admin error:', error)
    res.status(500).json({ error: 'Failed to fetch stores' })
  }
}

export const createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body

  try {
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email])
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists with this email' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await query(
      `INSERT INTO users (name, email, password, address, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, address, role, created_at`,
      [name, email, hashedPassword, address, role]
    )

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    })
  } catch (error) {
    console.error('Create user error:', error)
    res.status(500).json({ error: 'Failed to create user' })
  }
}

export const createStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body

  try {
    const existingStore = await query('SELECT id FROM stores WHERE email = $1', [email])
    if (existingStore.rows.length > 0) {
      return res.status(409).json({ error: 'Store with this email already exists' })
    }

    const owner = await query('SELECT id, role FROM users WHERE id = $1', [ownerId])
    if (owner.rows.length === 0) {
      return res.status(404).json({ error: 'Owner not found' })
    }
    if (owner.rows[0].role !== 'store_owner') {
      return res.status(400).json({ error: 'Selected user is not a store owner' })
    }

    const result = await query(
      `INSERT INTO stores (name, email, address, owner_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, address, owner_id, created_at`,
      [name, email, address, ownerId]
    )

    res.status(201).json({
      message: 'Store created successfully',
      store: result.rows[0]
    })
  } catch (error) {
    console.error('Create store admin error:', error)
    res.status(500).json({ error: 'Failed to create store' })
  }
}

export const updateUserRole = async (req, res) => {
  const { userId } = req.params
  const { role } = req.body

  const validRoles = ['admin', 'user', 'store_owner']
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' })
  }

  try {
    const result = await query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      message: 'User role updated successfully',
      user: result.rows[0]
    })
  } catch (error) {
    console.error('Update user role error:', error)
    res.status(500).json({ error: 'Failed to update user role' })
  }
}

export const getUserDetails = async (req, res) => {
  const { userId } = req.params

  try {
    const userResult = await query(
      `SELECT id, name, email, address, role, created_at 
       FROM users 
       WHERE id = $1`,
      [userId]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = userResult.rows[0]

    let storeInfo = null
    if (user.role === 'store_owner') {
      const storeResult = await query(
        `SELECT s.id, s.name, s.email, s.address, 
                COALESCE(AVG(r.rating), 0) as average_rating,
                COUNT(r.rating) as total_ratings
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = $1
         GROUP BY s.id`,
        [userId]
      )

      if (storeResult.rows.length > 0) {
        storeInfo = {
          ...storeResult.rows[0],
          average_rating: parseFloat(storeResult.rows[0].average_rating).toFixed(1)
        }
      }
    }

    res.json({
      user,
      store: storeInfo
    })
  } catch (error) {
    console.error('Get user details error:', error)
    res.status(500).json({ error: 'Failed to fetch user details' })
  }
}