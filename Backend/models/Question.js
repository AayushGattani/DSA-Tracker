import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true
  },
  notes: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: null,
    trim: true
  },
  solvedDate: {
    type: Date,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
questionSchema.index({ userId: 1, solvedDate: -1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;
