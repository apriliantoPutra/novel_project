const express = require('express');
const router= express.Router();

const {
    verifyToken,
    verifyRole
}= require('../middlewares/auth')

const {
    createChapter,
    getChapterByNovel,
    getChapterById,
    updateChapter,
    deleteChapter
}= require('../controllers/chapterController');

router.post('/novel/:novelId/chapter', verifyToken, verifyRole('admin', 'author'),createChapter);
router.get('/novel/:novelId/chapters', getChapterByNovel);
router.get('/chapter/:id', verifyToken, getChapterById);
router.put('/chapter/:id', verifyToken, verifyRole('admin', 'author'), updateChapter);
router.delete('/chapter/:id', verifyToken, verifyRole('admin', 'author'), deleteChapter);

module.exports= router;