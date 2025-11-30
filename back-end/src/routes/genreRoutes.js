const express = require('express');
const router= express.Router();

const {
    verifyToken,
    verifyRole
}= require('../middlewares/auth')

const {
    createGenre,
    getAllGenre,
    getGenreById,
    deleteGenre
}= require('../controllers/genreController');

router.get('/', getAllGenre);
router.get('/detail/:id', getGenreById);
router.post('/create', verifyToken, verifyRole('admin'), createGenre);
router.delete('/delete/:id', verifyToken, verifyRole('admin'),deleteGenre);

module.exports= router;