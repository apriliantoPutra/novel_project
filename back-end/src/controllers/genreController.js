const pool = require('../config/db');

const getAllGenre= async(req, res)=> {
    try {
        const result= await pool.query(
        `SELECT * FROM genres
        ORDER BY id ASC 
        `
        );

        res.status(200).json({
            message: 'All genre retrieved successfully',
            count: result.rowCount,
            data: result.rows,
        });

    } catch (error) {
        console.log('Error get all genre:', error);
        res.status(500).json({
            error: 'Failded to get all genre'
        });
    }
}
const getGenreById= async(req, res)=> {
    try {
        const {id}= req.params;
        const result= await pool.query(`
        SELECT * FROM genres
        WHERE id= $1   
        `, [id]);

        if(result.rowCount == 0){
            return res.status(404).json({ error: 'Genre not found' });
        }

        res.status(200).json({
            message: 'Genre found',
            data: result.rows[0]
        });
        
    } catch (error) {
        console.log('Error get genre:', error);
        res.status(500).json({
            error: 'Failed to genre by id'
        });
    }
}

const createGenre= async (req, res)=> {
    try {
        const {name, description}= req.body;
        const query= `
        INSERT INTO genres (name, description)
        VALUES ($1, $2)
        RETURNING *
        `;

        const values= [name, description];
        const result= await pool.query(query, values);
        
        res.status(201).json({
            message: 'Genre created successfully',
            data: result.rows[0],
        });
    } catch (error) {
        console.log('Error creating genre:', error);
        res.status(500).json({
            error: 'Failded to create genre'
        });
    }
}
const deleteGenre= async(req, res)=> {
    try {
        const {id}= req.params;
        const check= await pool.query(`
            SELECT * FROM genres
            WHERE id= $1
        `, [id]);

        if(check.rowCount == 0){
            return res.status(404).json({ error: 'Genre not found' });
        }

        await pool.query(
        `DELETE FROM genres 
        WHERE id= $1
        `, [id]);

        res.status(200).json({
            message: 'Genre deleted successfully',
            
        });
        
    } catch (error) {
        console.log('Error deleting genre:', error);
        res.status(500).json({
            error: 'Failed to delete genre'
        });
    }
}

module.exports= {
    getAllGenre,
    getGenreById,
    createGenre,
    deleteGenre
}