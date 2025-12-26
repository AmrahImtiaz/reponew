import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"]
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6
    },
  // Progress fields
  points: {
    type: Number,
    default: 0
  },
  answers: {
    type: Number,
    default: 0
  },
  questions: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  badges: {
    type: [String],
    default: []
  }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
