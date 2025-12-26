import Answer from '../models/answer.model.js';
import Question from '../models/question.model.js';
import userModel from '../models/user.model.js';
import { checkBadges } from '../utils/badgeChecker.js';

export const addAnswer = async (req, res) => {
  const { id: questionId } = req.params;
  const { content } = req.body;
  try {
    const q = await Question.findById(questionId);
    if (!q) return res.status(404).json({ message: 'Question not found' });

    const answer = await Answer.create({
      question: questionId,
      author: req.user?._id,
      content
    });

    // increment question answersCount
    q.answersCount = (q.answersCount || 0) + 1;
    await q.save();

    // ⭐ Add +3 points to the answer creator
    await userModel.findByIdAndUpdate(req.user._id, {
      $inc: { points: 3, answers: 1 }
    });

    // ⭐ Fetch user and check badges
    const user = await userModel.findById(req.user._id);
    checkBadges(user);
    await user.save();

    const populated = await Answer.findById(answer._id).populate('author', 'name reputation badges');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

export const listAnswers = async (req, res) => {
  const { id: questionId } = req.params;
  try {
    const answers = await Answer.find({ question: questionId })
      .populate('author', 'name reputation badges')
      .sort({ createdAt: -1 });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const voteAnswer = async (req, res) => {
  const { answerId } = req.params;
  const { type } = req.body;
  try {
    const a = await Answer.findById(answerId);
    if (!a) return res.status(404).json({ message: 'Answer not found' });

    if (a.author.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot vote your own answer" });
    }

    a.votes = a.votes + (type === 'up' ? 1 : -1);
    await a.save();

    const addPoints = type === 'up' ? 3 : -3;
    await userModel.findByIdAndUpdate(a.author, {
      $inc: { points: addPoints }
    });

    // ⭐ Fetch user and check badges
    const user = await userModel.findById(a.author);
    checkBadges(user);
    await user.save();

    res.json({ votes: a.votes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
