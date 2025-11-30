const pool = require('../config/db');
const bcrypt= require('bcrypt');
const path= require('path');
const fs= require('fs')

const getAllUser= async (req, res)=> {
    try {
        const result = await pool.query(`
        SELECT id, username, email, role, avatar_url, created_at
        FROM users
        ORDER BY id ASC;    
        `);

        // Modifikasi avatar_url menjadi full URL
        const usersWithFullAvatarUrl = result.rows.map(user => ({
            ...user,
            avatar_url: user.avatar_url ? `http://localhost:5000${user.avatar_url}` : null
        }));

        res.status(200).json({
            message: 'All users retrieved successfully',
            count: result.rowCount,
            data: usersWithFullAvatarUrl,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}
const getUserById= async (req, res)=> {
    try {
        const {id}= req.params
        const result= await pool.query(`
        SELECT id, username, email, role, avatar_url, created_at
        FROM users
        WHERE id= $1;`
        , [id]
        );
        
        if (result.rowCount === 0){
            return res.status(404).json({ error: 'User not found' });
        }
        // Modifikasi avatar_url menjadi full URL
        const user = result.rows[0];
        const userWithFullAvatarUrl = {
            ...user,
            avatar_url: user.avatar_url ? `http://localhost:5000${user.avatar_url}` : null
        };

        res.status(200).json({
            message: 'User found',
            data: userWithFullAvatarUrl,
        });
        
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}
const getUserByLogin= async (req, res)=> {
    try {
        const userId= req.user.id;
        const result= await pool.query(`
        SELECT id, username, email, role, avatar_url, created_at
        FROM users
        WHERE id= $1;`
        , [userId]
        );
        
        if (result.rowCount === 0){
            return res.status(404).json({ error: 'User not found' });
        }
        // Modifikasi avatar_url menjadi full URL
        const user = result.rows[0];
        const userWithFullAvatarUrl = {
            ...user,
            avatar_url: user.avatar_url ? `http://localhost:5000${user.avatar_url}` : null
        };

        res.status(200).json({
            message: 'User found',
            data: userWithFullAvatarUrl,
        });
        
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

const createUser= async (req, res)=> {
    try {
        const {username, email, password, role}= req.body;
         // Validasi input
        if (!username || !email || !password) {
            return res.status(400).json({
                error: 'Username, email, and password are required'
            });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // handle avatar img
        let avatar_url= null;
        if (req.file) {
            avatar_url = `/public/img/avatar/${req.file.filename}`;
        }

        const query= `
            INSERT INTO users (username, email, password, role, avatar_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, username, email, role, avatar_url, created_at;
        `;

        const values= [username, email, hashedPassword, role || 'reader', avatar_url];
        const result= await pool.query(query, values);

        const userResponse = {
            id: result.rows[0].id,
            username: result.rows[0].username,
            email: result.rows[0].email,
            role: result.rows[0].role,
            avatar_url: result.rows[0].avatar_url
                ? `http://localhost:5000${result.rows[0].avatar_url}`
                : null,
            created_at: result.rows[0].created_at
        };

        res.status(201).json({
            message: 'User created successfully',
            data: userResponse,
        });
    } catch (error) {
        console.log('Error creating user:', error);
        res.status(500).json({
            error: 'Failded to create user'
        });
    }
}
const updateUserById= async (req, res)=> {
    try {
        const {id}= req.params;
        const {username, email, password, role}= req.body;

        // cek apakah ada data
        const existing = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (existing.rowCount === 0){
            return res.status(404).json({ error: 'User not found' });
        }

        let avatar_url= existing.rows[0].avatar_url;
        if(req.file){
            // hapus file lama jika ada
            if(avatar_url){
                const oldPath= path.join(process.cwd(), avatar_url);
                if (fs.existsSync(oldPath) ){
                    fs.unlinkSync(oldPath);
                }
            }
            avatar_url= `/public/img/avatar/${req.file.filename}`;
        }

        let hashedPassword= existing.rows[0].password;
        if(password){
            hashedPassword= await bcrypt.hash(password, 10);
        }

        const result = await pool.query(
        `UPDATE users 
        SET username = $1, email = $2, password = $3, role = $4, avatar_url = $5, updated_at = NOW()
        WHERE id = $6
        RETURNING id, username, email, role, avatar_url, updated_at;`,
        [username || existing.rows[0].username,
        email || existing.rows[0].email,
        hashedPassword,
        role || existing.rows[0].role,
        avatar_url,
        id]
        );

       const updatedUser = result.rows[0];

        // Bentuk response
        const userResponse = {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar_url: updatedUser.avatar_url
            ? `http://localhost:5000${updatedUser.avatar_url}`
            : null,
        updated_at: updatedUser.updated_at,
        };

        res.status(200).json({
            message: 'User updated successfully',
            data: userResponse,
        });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
}
const updateUser= async (req, res)=> {
    try {
        const userId= req.user.id;
        const {username, email, password, role}= req.body;

        // cek apakah ada data
        const existing = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (existing.rowCount === 0){
            return res.status(404).json({ error: 'User not found' });
        }

        let avatar_url= existing.rows[0].avatar_url;
        if(req.file){
            // hapus file lama jika ada
            if(avatar_url){
                const oldPath= path.join(process.cwd(), avatar_url);
                if (fs.existsSync(oldPath) ){
                    fs.unlinkSync(oldPath);
                }
            }
            avatar_url= `/public/img/avatar/${req.file.filename}`;
        }

        let hashedPassword= existing.rows[0].password;
        if(password){
            hashedPassword= await bcrypt.hash(password, 10);
        }

        const result = await pool.query(
        `UPDATE users 
        SET username = $1, email = $2, password = $3, role = $4, avatar_url = $5, updated_at = NOW()
        WHERE id = $6
        RETURNING id, username, email, role, avatar_url, updated_at;`,
        [username || existing.rows[0].username,
        email || existing.rows[0].email,
        hashedPassword,
        role || existing.rows[0].role,
        avatar_url,
        userId]
        );

       const updatedUser = result.rows[0];

        // Bentuk response
        const userResponse = {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar_url: updatedUser.avatar_url
            ? `http://localhost:5000${updatedUser.avatar_url}`
            : null,
        updated_at: updatedUser.updated_at,
        };

        res.status(200).json({
            message: 'User updated successfully',
            data: userResponse,
        });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
}
const deleteUser= async (req, res)=> {
    try {
        const {id}= req.params;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rowCount === 0){
            return res.status(404).json({ error: 'User not found' });
        }

        // hapus avatar jika ada
        const avatar_url= result.rows[0].avatar_url;
        if(avatar_url){
            const filePath= path.join(process.cwd(), avatar_url);
            if(fs.existsSync(filePath)){
                fs.unlinkSync(filePath);
            }
        }

        await pool.query('DELETE FROM users WHERE id= $1', [id]);
        res.status(200).json({
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}


module.exports= {
    getAllUser,
    getUserById,
    getUserByLogin,
    createUser,
    updateUser,
    updateUserById,
    deleteUser
}