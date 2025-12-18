const express = require('express');
const router= express.Router();
const upload= require('../config/multer');

// middleware
const {
    verifyToken,
    verifyRole
}= require('../middlewares/auth');

// controller
const {
    createUser,
    getAllUser,
    getUserByLogin,
    updateUser,
    deleteUser,
    getUserById,
    updateUserById
}= require('../controllers/userController');

router.get('/', verifyToken, verifyRole('admin'),getAllUser);
router.get('/detail', verifyToken, getUserByLogin);
router.put('/edit',   verifyToken, upload.single('avatar'), updateUser);


router.post('/',  verifyToken, verifyRole('admin'),  upload.single('avatar'), createUser); 
router.get('/:id', verifyToken, verifyRole('admin'), getUserById);
router.put('/:id',   verifyToken,  verifyRole('admin'), upload.single('avatar'), updateUserById);
router.delete('/:id',  verifyToken, verifyRole('admin'), deleteUser);
module.exports= router;