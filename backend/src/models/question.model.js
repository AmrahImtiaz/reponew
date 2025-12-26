import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  subject: { type: String },
  difficulty: { type: String },
  mediaUrl: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  votes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  answersCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
