const express = require('express');
const router= express.Router();
const upload= require('../config/multer');

const {
    verifyToken,
    verifyRole
}= require('../middlewares/auth')

const {
    getAllNovel,
    getNovelById,
    createNovel,
    updateNovel,
    deleteNovel,
    getAllNovelByAuthor,
}= require('../controllers/novelController');

router.get('/', getAllNovel);
router.get('/author', verifyToken, verifyRole('author'), getAllNovelByAuthor);

router.get('/detail/:id', getNovelById);
router.post('/create',  verifyToken, verifyRole('admin', 'author'), upload.single('cover'), createNovel);
router.put('/edit/:id', verifyToken, verifyRole('admin', 'author'), upload.single('cover'), updateNovel);
router.delete('/delete/:id', verifyToken, verifyRole('admin', 'author'), deleteNovel);

module.exports= router;