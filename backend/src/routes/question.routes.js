import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
createQuestion,
listQuestions,
getQuestion,
voteQuestion
} from '../controllers/question.controller.js';

const router = express.Router();

// Multer simple disk storage
const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, 'uploads/'),
filename: (req, file, cb) => {
const ext = file.originalname.split('.').pop();
cb(null, `${Date.now()}-${Math.random().toString(36).substring(2,8)}.${ext}`);
}
});

// File filter: only allow jpg, jpeg, svg
const fileFilter = (req, file, cb) => {
const allowedTypes = /jpeg|jpg|svg/;
const ext = file.originalname.split('.').pop().toLowerCase();
if (allowedTypes.test(ext)) cb(null, true);
else cb(new Error('Only JPG, JPEG, and SVG files are allowed'), false);
};

const upload = multer({ storage, fileFilter });

// Routes
// router.post('/', upload.single('media'), createQuestion);
router.post('/', authMiddleware, upload.single('media'), createQuestion);
router.get('/', listQuestions);
router.get('/:id', getQuestion);
router.put('/:id/vote', authMiddleware, voteQuestion); // or POST to /:id/vote
// router.put('/:id/vote', voteQuestion); // or POST to /:id/vote

export default router;
