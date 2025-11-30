const multer= require('multer');
const path= require('path');
const fs= require('fs')

// Gunakan path absolut dari root project, bukan relatif ke file
const baseDir = path.join(process.cwd(), 'public', 'img');

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        // buat folder sesuai fieldname (avatar, cover, dll)
        const folderName= file.fieldname; // contoh: avatar, cover
        const uploadPath= path.join(baseDir, folderName);
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, {recursive: true})
        }
        cb(null, uploadPath);
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + uniqueSuffix + ext;
        cb(null, filename);
    }

});

const fileFilter= (req, file, cb)=> {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
}
const upload= multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

module.exports= upload;

