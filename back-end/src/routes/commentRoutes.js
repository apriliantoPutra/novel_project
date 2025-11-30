const express = require('express');
const router= express.Router();

const {
    verifyToken,
    verifyRole
}= require('../middlewares/auth')

const { createComment, getAllComments, getCommentById, updateComment, deleteComment }= require('../controllers/commentController');

router.post('/', verifyToken, createComment);
router.get('/', getAllComments);
router.get('/:id', getCommentById);
router.put('/:id', verifyToken, updateComment);
router.delete('/:id', verifyToken, deleteComment);

module.exports= router;
