const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const isAdmin = require('../../middlewares/isAdmin');

// Ensure upload directory exists
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Created directory: ${dirPath}`);
    }
};

// Create CKEditor images upload directory on module load
const postsImagesDir = path.join(__dirname, '../../public/uploads/posts/images');
ensureDirectoryExists(postsImagesDir);

// Configure multer for CKEditor image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'public/uploads/posts/images/';
        ensureDirectoryExists(uploadPath); // Double check before upload
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)'));
        }
    }
});

// [POST] /admin/upload/image - CKEditor image upload
router.post('/image', isAdmin, upload.single('upload'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                uploaded: false,
                error: {
                    message: 'Không có file được upload'
                }
            });
        }

        // CKEditor expects this response format
        const fileUrl = `/uploads/posts/images/${req.file.filename}`;
        
        res.json({
            uploaded: true,
            url: fileUrl
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            uploaded: false,
            error: {
                message: error.message || 'Lỗi khi upload ảnh'
            }
        });
    }
});

module.exports = router;
