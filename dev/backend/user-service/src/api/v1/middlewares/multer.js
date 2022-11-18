const uniqueFilename = require('unique-filename');
const multer = require('multer');
const path = require('path');

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: (req, file, next) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            next(new Error('Invalid file type'));
        } else {
            next(null, true);
        }
    },
});

module.exports = upload;
