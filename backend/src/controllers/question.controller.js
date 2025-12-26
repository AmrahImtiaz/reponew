import Question from '../models/question.model.js';
import userModel from '../models/user.model.js';
import mongoose from 'mongoose';
import { checkBadges } from '../utils/badgeChecker.js';

export const createQuestion = async (req, res) => {
  const { title, content, tags = [], subject, difficulty } = req.body;
  const mediaUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  try {
    const q = await Question.create({
      title,
      content,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean),
      subject,
      difficulty,
      mediaUrl,
      author: req.user?._id
    });

    // ⭐ Update points for question creator
    await userModel.findByIdAndUpdate(req.user._id, {
      $inc: { questions: 1 } // aap chahe to points field bhi yahan increment kar sakte ho
    });

    // ⭐ Fetch user and check badges
    const user = await userModel.findById(req.user._id);
    checkBadges(user);
    await user.save();

    res.status(201).json(q);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

export const listQuestions = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort === 'votes' ? { votes: -1 } : { createdAt: -1 };

  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { title: new RegExp(req.query.search, 'i') },
      { content: new RegExp(req.query.search, 'i') },
      { tags: new RegExp(req.query.search, 'i') }
    ];
  }
  if (req.query.subject) filter.subject = req.query.subject;

  try {
    const total = await Question.countDocuments(filter);
    const questions = await Question.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('author', 'name reputation badges')
      .lean();

    res.json({ data: questions, page, limit, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const q = await Question.findById(id).populate('author', 'name reputation badges');
    if (!q) return res.status(404).json({ message: 'Question not found' });

    // increment view count
    q.views = (q.views || 0) + 1;
    await q.save();

    res.json({ question: q });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const voteQuestion = async (req, res) => {
  let { id } = req.params;
  if (!id) id = req.query.id;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid or missing question ID" });
  }

  const type = req.body.type || req.query.type;
  if (!type || !['up','down'].includes(type)) {
    return res.status(400).json({ message: "type must be 'up' or 'down'" });
  }

  try {
    const q = await Question.findById(id);
    if (!q) return res.status(404).json({ message: "Question not found" });

    if (q.author.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot vote your own question" });
    }

    q.votes = (q.votes || 0) + (type === 'up' ? 1 : -1);
    await q.save();

    // ⭐ Update points for question author
    const pointsToAdd = type === 'up' ? 3 : -2;
    await userModel.findByIdAndUpdate(q.author, { $inc: { points: pointsToAdd } });

    // ⭐ Fetch user and check badges
    const user = await userModel.findById(q.author);
    checkBadges(user);
    await user.save();

    res.json({ votes: q.votes });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
