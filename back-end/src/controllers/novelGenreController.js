const pool = require('../config/db');

// Tambahkan 1 atau beberapa genre ke novel (/api/novel/:novelId/genres)
const addGenresToNovel = async (req, res) => {
  try {
    const { novelId } = req.params;
    const { genre_ids } = req.body;

    // Validasi array
    if (!genre_ids || !Array.isArray(genre_ids)) {
      return res.status(400).json({ error: 'genre_ids must be an array' });
    }

    // 🔹 Cek apakah novel ada dan ambil author_id
    const novelCheck = await pool.query(
      'SELECT id, author_id FROM novels WHERE id = $1',
      [novelId]
    );
    if (novelCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Novel not found' });
    }

    const novel = novelCheck.rows[0];

    // 🔹 Cek otorisasi
    if (req.user.role !== 'admin' && req.user.id !== novel.author_id) {
      return res.status(403).json({
        error: 'You are not allowed to add genres to this novel',
      });
    }

    // 🔹 Insert ke tabel relasi (hindari duplikasi)
    const insertPromises = genre_ids.map((gid) =>
      pool.query(
        `
        INSERT INTO novel_genres (novel_id, genre_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        `,
        [novelId, gid]
      )
    );

    await Promise.all(insertPromises);

    res.status(201).json({
      message: 'Genres added to novel successfully',
      data: genre_ids,
    });
  } catch (error) {
    console.error('Error adding genres:', error);
    res.status(500).json({ error: 'Failed to add genres' });
  }
};


// Tampilkan semua genre dari novel tertentu (/api/novel/:novelId/genres)
const getGenresByNovel= async(req, res)=> {
    try {
        const {novelId}= req.params;

        const result= await pool.query(`
        SELECT g.id, g.name
        FROM genres g
        JOIN novel_genres ng ON g.id= ng.genre_id
        WHERE ng.novel_id= $1    
        `, [novelId]);

        res.status(200).json({
            message: 'Genres retrieved successfully',
            count: result.rowCount,
            data: result.rows,
        });
        
    } catch (error) {
        console.error('Error fetching genres:', error);
        res.status(500).json({ error: 'Failed to fetch genres' });
    }
}

// Hapus genre tertentu dari novel (/api/novel/:novelId/genre/:genreId)
const removeGenreFromNovel = async (req, res) => {
  try {
    const { novelId, genreId } = req.params;

    // 🔹 Cek apakah novel ada dan ambil author_id
    const novelCheck = await pool.query(
      'SELECT id, author_id FROM novels WHERE id = $1',
      [novelId]
    );
    if (novelCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Novel not found' });
    }

    const novel = novelCheck.rows[0];

    // 🔹 Cek otorisasi
    if (req.user.role !== 'admin' && req.user.id !== novel.author_id) {
      return res.status(403).json({
        error: 'You are not allowed to remove genres from this novel',
      });
    }

    // 🔹 Cek apakah relasi novel-genre ada
    const check = await pool.query(
      `
      SELECT * FROM novel_genres 
      WHERE novel_id = $1 AND genre_id = $2
      `,
      [novelId, genreId]
    );

    if (check.rowCount === 0) {
      return res
        .status(404)
        .json({ error: 'Genre not found for this novel' });
    }

    // 🔹 Hapus relasi
    await pool.query(
      `
      DELETE FROM novel_genres 
      WHERE novel_id = $1 AND genre_id = $2
      `,
      [novelId, genreId]
    );

    res.status(200).json({
      message: 'Genre removed from novel successfully',
    });
  } catch (error) {
    console.error('Error removing genre:', error);
    res.status(500).json({ error: 'Failed to remove genre' });
  }
};


// Tampilkan semua novel dengan genre tertentu (/api/genre/:genreId/novels)
const getNovelByGenre = async (req, res) => {
  try {
    const { genreId } = req.params;

    const result = await pool.query(`
      SELECT n.id, n.title, n.synopsis, n.status, n.cover_url
      FROM novels n
      JOIN novel_genres ng ON n.id = ng.novel_id
      WHERE ng.genre_id = $1
    `, [genreId]);

    res.status(200).json({
      message: 'Novels retrieved successfully',
      count: result.rowCount,
      data: result.rows.map(novel => ({
        ...novel,
        cover_url: novel.cover_url
          ? `http://localhost:5000${novel.cover_url}`
          : null,
      })),
    });

  } catch (error) {
    console.error('Error fetching novels by genre:', error);
    res.status(500).json({ error: 'Failed to fetch novels by genre' });
  }
};



module.exports= {
    addGenresToNovel,
    getGenresByNovel,
    removeGenreFromNovel,
    getNovelByGenre
}
