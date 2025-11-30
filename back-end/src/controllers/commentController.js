const pool = require('../config/db');

const createComment = async (req, res) => {
  try {
    const { novel_id, chapter_id, parent_comment_id, content } = req.body;

    // 🔹 Validasi input
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // 🔹 Ambil user_id langsung dari token
    const userId = req.user.id;

    // 🔹 Insert komentar
    const query = `
      INSERT INTO comments (user_id, novel_id, chapter_id, parent_comment_id, content)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [userId, novel_id || null, chapter_id || null, parent_comment_id || null, content];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Comment created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

const getAllComments= async (req, res)=> {
    try {
        const { novel_id, chapter_id, parent_comment_id } = req.query;
        let query= `
        SELECT c.*, u.username FROM comments c
        LEFT JOIN users u ON c.user_id = u.id 
        WHERE 1=1`;
        const values= [];

        if(novel_id){
            values.push(novel_id);
            query += ` AND c.novel_id = $${values.length}`;
        }
        
        // jika ingin komentar untuk novel (chapter_id null)
        if (chapter_id === 'null') {
            query += ` AND c.chapter_id IS NULL`;
        } else if (chapter_id) {
            values.push(chapter_id);
            query += ` AND c.chapter_id = $${values.length}`;
        }

        if (parent_comment_id) {
            values.push(parent_comment_id);
            query += ` AND c.parent_comment_id = $${values.length}`;
        }


        if (parent_comment_id) {
            values.push(parent_comment_id);
            query += ` AND c.parent_comment_id = $${values.length}`;
        }
        query += ` ORDER BY c.updated_at DESC`;

        const result= await pool.query(query, values);

        res.status(200).json({
            message: 'Comments fetched successfully',
            count: result.rowCount,
            data: result.rows,
        });


    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
}
const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json({
      message: 'Comment fetched successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({ error: 'Failed to fetch comment' });
  }
};
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Cek apakah komentar ada
    const check = await pool.query(`SELECT * FROM comments WHERE id = $1`, [id]);
    if (check.rowCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const comment = check.rows[0];

    // Cek hak akses (hanya pemilik atau admin)
    if (req.user.id !== comment.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to edit this comment' });
    }

    // Update komentar
    const result = await pool.query(
      `
      UPDATE comments
      SET content = $1
      WHERE id = $2
      RETURNING *;
      `,
      [content, id]
    );

    res.status(200).json({
      message: 'Comment updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah komentar ada
    const check = await pool.query(`SELECT * FROM comments WHERE id = $1`, [id]);
    if (check.rowCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const comment = check.rows[0];

    // Cek hak akses
    if (req.user.id !== comment.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    // Hapus komentar
    await pool.query(`DELETE FROM comments WHERE id = $1`, [id]);

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};


module.exports= {
    createComment,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment
};