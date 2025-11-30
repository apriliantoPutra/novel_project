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
router.post('/create',  verifyToken, verifyRole('admin'),  upload.single('avatar'), createUser); 
router.put('/edit',   verifyToken, upload.single('avatar'), updateUser);

router.get('/detail/:id', verifyToken, verifyRole('admin'), getUserById);
router.put('/edit/:id',   verifyToken,  verifyRole('admin'), upload.single('avatar'), updateUserById);
router.delete('/delete/:id',  verifyToken, verifyRole('admin'), deleteUser);

module.exports= router;