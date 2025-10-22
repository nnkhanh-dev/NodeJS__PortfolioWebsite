const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Created directory: ${dirPath}`);
    }
};

// Create user upload directories on module load
const avatarsDir = path.join(__dirname, '../public/uploads/avatars');
const resumesDir = path.join(__dirname, '../public/uploads/resumes');
ensureDirectoryExists(avatarsDir);
ensureDirectoryExists(resumesDir);

// Cấu hình lưu trữ file cho user profile
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'avatar') {
            const uploadPath = 'public/uploads/avatars/';
            ensureDirectoryExists(uploadPath); // Double check before upload
            cb(null, uploadPath);
        } else if (file.fieldname === 'resume') {
            const uploadPath = 'public/uploads/resumes/';
            ensureDirectoryExists(uploadPath); // Double check before upload
            cb(null, uploadPath);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Kiểm tra loại file
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'avatar') {
        // Chỉ chấp nhận file ảnh cho avatar
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Avatar chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)!'));
        }
    } else if (file.fieldname === 'resume') {
        // Chỉ chấp nhận file PDF cho resume
        const allowedTypes = /pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = file.mimetype === 'application/pdf';

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Resume chỉ chấp nhận file PDF!'));
        }
    }
};

// Cấu hình upload
const uploadUser = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Giới hạn 10MB
    },
    fileFilter: fileFilter
});

module.exports = uploadUser;
