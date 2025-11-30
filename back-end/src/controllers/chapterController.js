const pool = require('../config/db');

// Tambah chapter baru ke novel tertentu (/api/novel/:novelId/chapter)
const createChapter = async (req, res) => {
  try {
    const { novelId } = req.params;
    const { title, content, chapter_number } = req.body;

   

    // 🔹 Cek apakah novel ada dan ambil author_id
    const novelCheck = await pool.query(
      'SELECT id, author_id FROM novels WHERE id = $1',
      [novelId]
    );

    if (novelCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Novel not found' });
    }

    const novel = novelCheck.rows[0];

    // 🔹 Cek otorisasi: hanya admin atau author asli yang bisa
    if (req.user.role !== 'admin' && req.user.id !== novel.author_id) {
      return res.status(403).json({
        error: 'You are not allowed to create chapters for this novel',
      });
    }

    // 🔹 Insert chapter baru
    const query = `
      INSERT INTO chapters (novel_id, title, content, chapter_number)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [novelId, title, content, chapter_number];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Chapter created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating chapter:', error);
    res.status(500).json({ error: 'Failed to create chapter' });
  }
};


// Tampilkan semua chapter milik novel (/api/novel/:novelId/chapters)
const getChapterByNovel= async (req, res)=> {
    try {
        const {novelId}= req.params;

        const result= await pool.query(`
        SELECT * FROM chapters
        WHERE novel_id = $1
        ORDER BY chapter_number ASC, created_at ASC
        `, [novelId]);

        res.status(200).json({
            message: 'Chapters retrieved successfully',
            count: result.rowCount,
            data: result.rows,
        });

    } catch (error) {
         console.error('Error fetching chapters:', error);
        res.status(500).json({ error: 'Failed to fetch chapters' });
    }
};

// Tampilkan 1 chapter (/api/chapter/:id)
const getChapterById= async (req, res)=> {
    try {
        const {id}= req.params;
        const result= await pool.query(`
        SELECT * FROM chapters
        WHERE id = $1     
        `, [id]);

         if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        res.status(200).json({
            message: 'Chapter retrieved successfully',
            data: result.rows[0],
        });

    } catch (error) {
        console.error('Error fetching chapter:', error);
        res.status(500).json({ error: 'Failed to fetch chapter' });
    }
}

// Update chapter (/api/chapter/:id)
const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, chapter_number } = req.body;

    // 🔹 Cek apakah chapter ada dan ambil novel_id
    const check = await pool.query(
      'SELECT * FROM chapters WHERE id = $1',
      [id]
    );
    if (check.rowCount === 0) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    const chapter = check.rows[0];

    // 🔹 Cek novel dan author_id
    const novelCheck = await pool.query(
      'SELECT author_id FROM novels WHERE id = $1',
      [chapter.novel_id]
    );

    if (novelCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Parent novel not found' });
    }

    const authorId = novelCheck.rows[0].author_id;

    // 🔹 Otorisasi
    if (req.user.role !== 'admin' && req.user.id !== authorId) {
      return res.status(403).json({
        error: 'You are not allowed to update this chapter',
      });
    }

    // 🔹 Lakukan update
    const query = `
      UPDATE chapters
      SET title = $1, content = $2, chapter_number = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *;
    `;
    const values = [
      title || chapter.title,
      content || chapter.content,
      chapter_number || chapter.chapter_number,
      id,
    ];

    const result = await pool.query(query, values);

    res.status(200).json({
      message: 'Chapter updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating chapter:', error);
    res.status(500).json({ error: 'Failed to update chapter' });
  }
};



// Hapus chapter (/api/chapter/:id)
const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 Cek apakah chapter ada dan ambil novel_id
    const check = await pool.query(
      'SELECT * FROM chapters WHERE id = $1',
      [id]
    );
    if (check.rowCount === 0) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    const chapter = check.rows[0];

    // 🔹 Cek author dari novel terkait
    const novelCheck = await pool.query(
      'SELECT author_id FROM novels WHERE id = $1',
      [chapter.novel_id]
    );

    if (novelCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Parent novel not found' });
    }

    const authorId = novelCheck.rows[0].author_id;

    // 🔹 Otorisasi
    if (req.user.role !== 'admin' && req.user.id !== authorId) {
      return res.status(403).json({
        error: 'You are not allowed to delete this chapter',
      });
    }

    // 🔹 Hapus chapter
    await pool.query('DELETE FROM chapters WHERE id = $1', [id]);

    res.status(200).json({
      message: 'Chapter deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    res.status(500).json({ error: 'Failed to delete chapter' });
  }
};



module.exports= {
    createChapter,
    getChapterByNovel,
    getChapterById,
    updateChapter,
    deleteChapter
};