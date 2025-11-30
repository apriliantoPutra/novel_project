const express = require('express');
const router= express.Router();

const {
    verifyToken,
    verifyRole
}= require('../middlewares/auth')

const { addGenresToNovel, getGenresByNovel, removeGenreFromNovel, getNovelByGenre }= require('../controllers/novelGenreController');

// Tambah genre ke novel
router.post('/novel/:novelId/genres', verifyToken, verifyRole('admin', 'author'),addGenresToNovel);
router.get('/novel/:novelId/genres', getGenresByNovel);
router.delete('/novel/:novelId/genre/:genreId', verifyToken, verifyRole('admin', 'author'),removeGenreFromNovel);
router.get('/genre/:genreId/novels', getNovelByGenre);

module.exports= router;