import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addAnswer, listAnswers, voteAnswer } from '../controllers/answer.controller.js';

const router = express.Router();

// add answer to question
router.post('/:id', authMiddleware, addAnswer);
// router.post('/:id', addAnswer);
router.get('/:id', listAnswers);

// vote on answer
 router.put('/vote/:answerId', authMiddleware, voteAnswer);
// router.put('/vote/:answerId',  voteAnswer);

export default router;
