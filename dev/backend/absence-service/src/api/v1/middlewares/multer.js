const uniqueFilename = require('unique-filename');
const multer = require('multer');
const path = require('path');

const uploadsFolder = path.join(__dirname, '../public/uploads')

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadsFolder)
	},
	filename: function (req, file, cb) {
		//make sure the file name is unique
		const uniqueName = uniqueFilename(uploadsFolder)

		const newName = uniqueName.split('\\').pop() + path.extname(file.originalname)
		cb(null, newName)
	},
})

const upload = multer({
	storage,
	limits: {
		fileSize: 1024 * 1024 * 5, // 5MB
	},
	fileFilter: (req, file, next) => {
		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
		if (!allowedTypes.includes(file.mimetype)) {
			next(new Error('Invalid file type'))
		} else {
			next(null, true)
		}
	},
})

module.exports = upload
