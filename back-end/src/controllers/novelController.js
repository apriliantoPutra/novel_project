const pool = require('../config/db');
const path= require('path');
const fs= require('fs');
const { title } = require('process');


const getAllNovel= async (req, res)=> {
    try {
        const result = await pool.query(`
        SELECT 
          n.id, 
          n.title, 
          n.cover_url, 
          n.status, 
          n.created_at, 
          u.username AS author, 
          COUNT(DISTINCT c2.id) AS total_chapters,

          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object('id', g.id, 'name', g.name)
            ) FILTER (WHERE g.id IS NOT NULL),
            '[]'
          ) AS genres,

          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'id', lc.id,
                'title', lc.title,
                'chapter_number', lc.chapter_number,
                'updated_at', lc.updated_at
              )
            ) FILTER (WHERE lc.id IS NOT NULL),
            '[]'
          ) AS latest_chapters

        FROM novels n
        LEFT JOIN users u ON n.author_id = u.id
        LEFT JOIN novel_genres ng ON n.id = ng.novel_id
        LEFT JOIN genres g ON ng.genre_id = g.id
        LEFT JOIN chapters c2 ON n.id = c2.novel_id

        LEFT JOIN LATERAL (
          SELECT c.id, c.title, c.chapter_number, c.updated_at
          FROM chapters c
          WHERE c.novel_id = n.id
          ORDER BY c.updated_at DESC
          LIMIT 3
        ) lc ON true

        GROUP BY n.id, u.username
        ORDER BY n.id ASC;
      `);

        const novels = result.rows.map(novel => ({
            id: novel.id,
            title: novel.title,
            status: novel.status,
            created_at: novel.created_at,
            cover_url: novel.cover_url 
                ? `http://localhost:5000${novel.cover_url}` 
                : null,
            genres: novel.genres,
            author: novel.author,
            total_chapters: Number(novel.total_chapters),
            latest_chapters: novel.latest_chapters
        }));

        res.status(200).json({
            message: 'All novels retrieved successfully',
            count: result.rowCount,
            data: novels,
        });
        
    } catch (error) {
        console.log('Error get all novel:', error);
        res.status(500).json({
            error: 'Failded to get all novel'
        });
    }
}
const getAllNovelByAuthor= async(req, res)=>{
  try {
    const authorId= req.user.id;
    const result = await pool.query( `
      SELECT n.id, n.title, n.cover_url, n.status, n.created_at, u.username AS author, COUNT(DISTINCT c.id) AS total_chapters, 
      COALESCE( json_agg( DISTINCT jsonb_build_object('id', g.id, 'name', g.name) ) FILTER (WHERE g.id IS NOT NULL), '[]' ) AS genres FROM novels n 
      LEFT JOIN users u ON n.author_id= u.id 
      LEFT JOIN novel_genres ng ON n.id = ng.novel_id 
      LEFT JOIN genres g ON ng.genre_id = g.id 
      LEFT JOIN chapters c ON n.id= c.novel_id
      WHERE n.author_id = $1 
      GROUP BY n.id, u.username 
      ORDER BY n.id ASC; `, [authorId]);

    const novels = result.rows.map(novel => ({
            id: novel.id,
            title: novel.title,
            status: novel.status,
            created_at: novel.created_at,
            cover_url: novel.cover_url 
                ? `http://localhost:5000${novel.cover_url}` 
                : null,
            genres: novel.genres,
            author: novel.author,
            total_chapters: Number(novel.total_chapters),
        }));

        res.status(200).json({
            message: 'All novels retrieved successfully',
            count: result.rowCount,
            data: novels,
        });

  } catch (error) {
    console.log('Error get all novel:', error);
        res.status(500).json({
            error: 'Failded to get all novel'
    });
  }
}

const getNovelById = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 Ambil data novel + genres + author
    const novelQuery = await pool.query(`
      SELECT n.id, n.author_id, u.username AS author, n.title, n.synopsis, n.cover_url, n.status, n.created_at,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('id', g.id, 'name', g.name)
          ) FILTER (WHERE g.id IS NOT NULL),
          '[]'
        ) AS genres
      FROM novels n
      LEFT JOIN users u ON n.author_id= u.id
      LEFT JOIN novel_genres ng ON n.id = ng.novel_id
      LEFT JOIN genres g ON ng.genre_id = g.id
      WHERE n.id = $1
      GROUP BY n.id, u.username;
    `, [id]);

    if (novelQuery.rowCount === 0) {
      return res.status(404).json({ error: 'Novel not found' });
    }

    const novel = novelQuery.rows[0];

    // 🔹 Ambil semua chapters dari novel
    const chaptersQuery = await pool.query(`
      SELECT 
        id,
        title,
        chapter_number,
        created_at,
        updated_at
      FROM chapters
      WHERE novel_id = $1
      ORDER BY chapter_number ASC;
    `, [id]);

    // 🔹 Ambil komentar (hanya yang untuk novel, bukan chapter)
    const commentsQuery = await pool.query(`
      SELECT 
        c.id,
        c.content,
        c.created_at,
        u.username,
        u.avatar_url
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.novel_id = $1 AND c.chapter_id IS NULL
      ORDER BY c.created_at DESC;
    `, [id]);

    // 🔹 Format data
    const novelResponse = {
      id: novel.id,
      author_id: novel.author_id,
      author: novel.author,
      title: novel.title,
      synopsis: novel.synopsis,
      status: novel.status,
      created_at: novel.created_at,
      cover_url: novel.cover_url 
        ? `http://localhost:5000${novel.cover_url}` 
        : null,
      genres: novel.genres,
      chapters: chaptersQuery.rows,
      comments: commentsQuery.rows.map(comment => ({
        ...comment,
        avatar_url: comment.avatar_url
          ? `http://localhost:5000${comment.avatar_url}`
          : null
      }))
    };

    // ✅ Response sukses
    res.status(200).json({
      message: 'Novel retrieved successfully',
      data: novelResponse,
    });

  } catch (error) {
    console.error('Error get novel by id:', error);
    res.status(500).json({
      error: 'Failed to get novel by id'
    });
  }
};

const createNovel= async (req, res)=> {
    try {
        const authorId= req.user.id;
        const {title, synopsis, genre_ids}= req.body;

        // validate genre_ids
        if (!genre_ids || !Array.isArray(genre_ids)) {
          return res.status(400).json({ error: 'genre_ids must be an array' });
        }
        
        // handle cover img
        let cover_url= null;
        if (req.file) {
            cover_url = `/public/img/cover/${req.file.filename}`;
        }

        const query= `
        INSERT INTO novels (author_id, title, synopsis, cover_url, status)
        VALUES ($1, $2, $3, $4, 'ongoing')
        RETURNING *
        `;

        const values= [authorId, title, synopsis, cover_url];
        const result= await pool.query(query, values);

        genre_ids.map(async (genreId)=> {
          pool.query(
            `INSERT INTO novel_genres (novel_id, genre_id) VALUES ($1, $2)
            ON CONFLICT DO NOTHING`, [result.rows[0].id, genreId]
          )
        })

        const novelResponse = {
            id: result.rows[0].id,
            author_id: result.rows[0].author_id,
            title: result.rows[0].title,
            synopsis: result.rows[0].synopsis,
            status: result.rows[0].status,
            cover_url: result.rows[0].cover_url
                ? `http://localhost:5000${result.rows[0].cover_url}`
                : null,
            
            created_at: result.rows[0].created_at
        };
        
        res.status(201).json({
            message: 'Novel created successfully',
            data: novelResponse,
        });
    } catch (error) {
        console.log('Error creating novel:', error);
        res.status(500).json({
            error: 'Failded to create novel'
        });
    }
}

const updateNovel = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, synopsis, status, genre_ids } = req.body;

    // validate genre_ids
    if (!genre_ids || !Array.isArray(genre_ids)) {
        return res.status(400).json({ error: 'genre_ids must be an array' });
    }

    // 🔹 Cek apakah novel ada
    const existing = await pool.query('SELECT * FROM novels WHERE id = $1', [id]);
    if (existing.rowCount === 0) {
      return res.status(404).json({ error: 'Novel not found' });
    }

    const novel= existing.rows[0];
    // cek otorisasi
     if (req.user.role !== 'admin' && req.user.id !== novel.author_id) {
      return res.status(403).json({ error: 'You are not allowed to edit this novel' });
    }

    let cover_url = novel.cover_url;
    // 🔹 Jika upload cover baru
    if (req.file) {
      // Hapus file lama jika ada
      if (cover_url) {
        const oldPath = path.join(process.cwd(), cover_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      cover_url = `/public/img/cover/${req.file.filename}`;
    }

    // 🔹 Update novel
    const result = await pool.query(
      `
      UPDATE novels 
      SET title = $1, synopsis = $2, status = $3, cover_url = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING id, author_id, title, synopsis, status, cover_url, updated_at;
    `,
      [
        title || novel.title,
        synopsis || novel.synopsis,
        status || novel.status,
        cover_url,
        id
      ]
    );

    // update genres
    await pool.query(`DELETE FROM novel_genres WHERE novel_id = $1`, [id])
    for (const genreId of genre_ids){
      await pool.query(
        `INSERT INTO novel_genres (novel_id, genre_id) VALUES ($1, $2)`, [id, genreId]
      )
    }

    res.status(200).json({
      message: 'Novel updated successfully',
      data: {
        ...result.rows[0],
        cover_url: result.rows[0].cover_url
          ? `http://localhost:5000${result.rows[0].cover_url}`
          : null
      }
    });

  } catch (error) {
    console.error('Error updating novel:', error);
    res.status(500).json({
      error: 'Failed to update novel',
    });
  }
};
const deleteNovel= async (req, res)=> {
    try {
        const {id}= req.params;
        const result = await pool.query('SELECT * FROM novels WHERE id = $1', [id]);
        if (result.rowCount === 0){
            return res.status(404).json({ error: 'Novel not found' });
        }
        const novel= result.rows[0];
         // 🔹 Cek otorisasi
        if (req.user.role !== 'admin' && req.user.id !== novel.author_id) {
          return res.status(403).json({ error: 'You are not allowed to delete this novel' });
        }

        // hapus cover jika ada
        const cover_url= novel.cover_url;
        if(cover_url){
            const filePath= path.join(process.cwd(), cover_url);
            if(fs.existsSync(filePath)){
                fs.unlinkSync(filePath);
            }
        }

        await pool.query('DELETE FROM novels WHERE id= $1', [id]);
        res.status(200).json({
            message: 'Novel deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting novel:', error);
        res.status(500).json({ error: 'Failed to delete novel' });
    }
}

module.exports= {
    getAllNovel,
    getAllNovelByAuthor,
    getNovelById,
    createNovel,
    updateNovel,
    deleteNovel
}